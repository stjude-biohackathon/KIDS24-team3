# this script will aggregate the following key metrics for each queue and user
""" 
- userId
- jobId
- jobIdx
- numProcessors  # num cpu cores
- jStatus
- submitTime  # epoch time when job was submitted
- startTime
- endTime
- queue
- memory_requested, to be extracted from resReq, per core
- maxRMem
- command
- cpuTime
- runTime
"""
import pandas as pd


def tally_jobs(df, queue_info_df):
    # epoch_start_time = 1724043600
    # epoch_end_time = 1724648400
    epoch_start_time = 1724151600
    epoch_end_time = 1724173200

    jobs_in_queue = []
    interval = 60 * 15  # 15 minute

    for i in range(epoch_start_time, epoch_end_time, interval):
        row = {}
        time_interval_start = i
        time_interval_end = i + interval

        row['time_window'] = (time_interval_start, time_interval_end)
        # get all running and pending jobs within the current time window

        # all runnning jobs should be started before the end of time window and finished after the begining of time window
        running_jobs = df[(df['startTime'] <= time_interval_end)
                          & (df['endTime'] > time_interval_start)]

        # all pending jobs should be submitted before the end of time window and started after the end of time window,
        # because if a job is started before the end of time window, it should be considered as a running job
        pending_jobs = df[(df['submitTime'] <= time_interval_end) & (
            df['startTime'] > time_interval_end)]

        # pending_jobs = df[(df['submitTime'] <= i) & (df['startTime'] > i)]
        for queue in df['queue'].unique():
            queue_running_jobs = running_jobs[running_jobs['queue'] == queue]
            queue_pending_jobs = pending_jobs[pending_jobs['queue'] == queue]

            row[queue + '_running_jobs'] = queue_running_jobs.shape[0]
            row[queue + '_pending_jobs'] = queue_pending_jobs.shape[0]

            # tally the total cores and memory using in running jobs, but take out the ones that finished the job in the time interval
            queue_finished_jobs = queue_running_jobs[queue_running_jobs['endTime']
                                                     <= time_interval_end]

            row[queue + '_total_cores'] = queue_running_jobs['numProcessors'].sum(
            ) - queue_finished_jobs['numProcessors'].sum()
            row[queue + '_total_memory'] = queue_running_jobs['maxRMem'].sum(
            ) - queue_finished_jobs['maxRMem'].sum()

            row[queue + '_available_cores'] = queue_info_df[queue_info_df['queue']
                                                            == queue]['cpu_cores'].values[0] - row[queue + '_total_cores']
            row[queue + '_available_memory'] = queue_info_df[queue_info_df['queue']
                                                             == queue]['mem'].values[0] - row[queue + '_total_memory']

        # for user in df['userId'].unique():
        #     user_running_jobs = running_jobs[running_jobs['userId'] == user]
        #     user_pending_jobs = pending_jobs[pending_jobs['userId'] == user]
        #     row[str(user) + '_running_jobs'] = user_running_jobs.shape[0]
        #     row[str(user) + '_pending_jobs'] = user_pending_jobs.shape[0]

        # append the row to the dataframe
        jobs_in_queue.append(row)
    return pd.DataFrame(jobs_in_queue)


def get_queue_info(queue_json):
    queue_info = pd.read_json(queue_json)
    queue_name = queue_info['queueName']
    queue_cores = queue_info['cpu_cores']
    queue_mem = queue_info['mem']
    queue_description = queue_info['description']
    # construct a dataframe to store the queue information
    queue_info_df = pd.DataFrame(
        {'queue': queue_name,
         'cpu_cores': queue_cores,
         'mem': queue_mem,
         'description': queue_description})
    return queue_info_df


def main():
    df = pd.read_csv('./finished_jobs_1_week.csv')

    # read in queue_info.json
    queue_info_df = get_queue_info('./queue_info.json')

    tally_result = tally_jobs(df, queue_info_df)

    tally_result.to_csv('tally_result.csv', index=False)


if __name__ == '__main__':
    main()
