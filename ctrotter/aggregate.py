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


def tally_jobs(df):
    epoch_start_time = 1724043600
    epoch_end_time = 1724648400
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

            row[queue + '_running_jobs'] = running_jobs[running_jobs['queue']
                                                        == queue].shape[0]
            row[queue + '_pending_jobs'] = pending_jobs[pending_jobs['queue']
                                                        == queue].shape[0]

            # tally the total cores and memory using in running jobs, but take out the ones that finished the job in the time interval
            finished_jobs = running_jobs[running_jobs['endTime']
                                         <= time_interval_end]

            row[queue + '_total_cores'] = running_jobs['numProcessors'].sum(
            ) - finished_jobs['numProcessors'].sum()
            row[queue + '_total_memory'] = running_jobs['maxRMem'].sum(
            ) - finished_jobs['maxRMem'].sum()

        # for user in df['userId'].unique():
        #     user_running_jobs = running_jobs[running_jobs['userId'] == user]
        #     user_pending_jobs = pending_jobs[pending_jobs['userId'] == user]
        #     jobs_in_queue_df[user +
        #                      '_running_jobs'] = user_running_jobs.shape[0]
        #     jobs_in_queue_df[user +
        #                      '_pending_jobs'] = user_pending_jobs.shape[0]

        # append the row to the dataframe
        jobs_in_queue.append(row)
    return pd.DataFrame(jobs_in_queue)


def main():
    df = pd.read_csv('./finished_jobs_1_week.csv')
    tally_result = tally_jobs(df)
    tally_result.to_csv('tally_result.csv', index=False)


if __name__ == '__main__':
    main()
