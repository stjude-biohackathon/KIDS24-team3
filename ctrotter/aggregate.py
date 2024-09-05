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
- queues
- memory_requested, to be extracted from resReq, per core
- maxRMem
- command
- cpuTime
- runTime
"""
import pandas as pd
import numpy as np


def tally_jobs(df):
    jobs_in_queue_df = pd.DataFrame()
    epoch_start_time = 1724043600
    epoch_end_time = 1724648400
    for i in range(epoch_start_time, epoch_end_time, 1):
        jobs_in_queue_df.iloc[i]['timestamp'] = i
        running_jobs = df[(df['startTime'] <= i) & (df['endTime'] >= i)]
        pending_jobs = df[(df['submitTime'] <= i) & (df['startTime'] > i)]
        jobs_in_queue_df.iloc[i]['running_jobs'] = running_jobs.shape[0]
        jobs_in_queue_df.iloc[i]['pending_jobs'] = pending_jobs.shape[0]

        # tally the total cores and memory using in running jobs
        jobs_in_queue_df.iloc[i]['total_cores'] = running_jobs['numProcessors'].sum(
        )
        jobs_in_queue_df.iloc[i]['total_memory'] = running_jobs['memory_requested'].sum(
        )

        for user in df['userId'].unique():
            user_running_jobs = running_jobs[running_jobs['userId'] == user]
            user_pending_jobs = pending_jobs[pending_jobs['userId'] == user]
            jobs_in_queue_df.iloc[i][user +
                                     '_running_jobs'] = user_running_jobs.shape[0]
            jobs_in_queue_df.iloc[i][user +
                                     '_pending_jobs'] = user_pending_jobs.shape[0]
