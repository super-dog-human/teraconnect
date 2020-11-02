# TERACONNECT

the recording and publishing tools for teaching lesson with virtual avatar.

## Setup development environment

### create JSON key for signing

```bash
$ yarn -s run jose newkey -t RSA -s 2048 -a RS256 -K > dev.jwk
$ yarn -s run jose findkey -p -j dev.jwk | yarn -s run pem-jwk | openssl rsa -RSAPublicKey_in -pubout > dev_public.pkcs8
```
