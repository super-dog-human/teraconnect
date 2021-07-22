# TERACONNECT
![teraconnect_recording](https://user-images.githubusercontent.com/15179279/126596989-2522216d-285b-46b5-998a-7d6c204948e0.png)

the recording and publishing tools for teaching lesson with virtual avatar.

### create JSON key for signing

```bash
$ yarn -s run jose newkey -t RSA -s 2048 -a RS256 -K > dev.jwk
$ yarn -s run jose findkey -p -j dev.jwk | yarn -s run pem-jwk | openssl rsa -RSAPublicKey_in -pubout > dev_public.pkcs8
```

### Deploy to GAE

```bash
$ gcloud config set project teraconnect-staging
$ gcloud config set project teraconnect-209509

$ yarn build && gcloud app deploy --appyaml=app.staging.yaml
$ gcloud app browse
```
