# Access Mongo


## TODO
- [ ] unnest the data into csv


## Valuable Keys

- userId
- jobId
- jobIdx
- numProcessors # num cpu cores
- jStatus
- submitTime # epoch time when job was submitted
- startTime
- endTime
- queues
- memory_requested, to be extracted from resReq, per core
- maxRMem
- command
- cpuTime
- runTime

## Method

### Data query

We collect all finished jobs which `submitTime>08/19/24 && endTime <= 08/26/24`. Sort it by submitTime, save to csv

### `mongoexport` command

```
mongoexport --collection=finished_jobs --db=lsf --out=finished_jobs_1_week.csv --fields "userId,jobId,jobIdx,numProcessors,jStatus,submitTime,startTime,endTime,queues,resReq,maxRMem,command,cpuTime,runTime" --query '{ "submitTime": { "$gt": 1724043600 }, "endTime": { "$lte": 1724648400 } }' --sort '{"submitTime": 1}' --type=csv
```

### CSV file

Check out `/home/lead/notebooks/common/finished_jobs_1_week.csv`


## Interesting ideas
- categorize submitTime timeOfDay/dayOfWeek/..

## Reference 

- https://www.mongodb.com/docs/languages/python/pymongo-driver/current/
