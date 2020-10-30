# TERACONNECT

the recording and publishing tools for teaching lesson with virtual avatar.

## Setup development environment

### create JSON key for signing

```bash
$ yarn run -s jose newkey -t RSA -s 2048 -K > dev_keystore.json
$ yarn run -s jose findkey -p -j dev_keystore.json > dev_public.json
```
