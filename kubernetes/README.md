# How to run Fortio to make load test from a pod

Fortio repo: <https://github.com/fortio/fortio>

```bash
kubectl run -it fortio --rm --image=fortio/fortio -- load -qps 800 -t 120s -c 70 "http://goserver-service/healthz"
```

- Run Fortio from one pod
- Using fortio docker image
- 800 querys/sec
- For 120sec
- With 70 gorotines
- On the url <http://goserver-service/healthz>

For checking the _horizontal pod scalling_(HPA) every second, run the following comman:

```bash
watch -n1 kubectl get hpa
```

OBS: Fortio will make the requests to port 80 of the service

Another option for load tests: [k6.io](https://k6.io/)
