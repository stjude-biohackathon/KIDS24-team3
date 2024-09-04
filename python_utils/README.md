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


## Interesting ideas
- categorize submitTime timeOfDay/dayOfWeek/..

## Reference 

- https://www.mongodb.com/docs/languages/python/pymongo-driver/current/
