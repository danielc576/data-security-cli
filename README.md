# Data Security CLI

This is CLI implementation for Data Dispersion and Data Replication Security Principles. 
This package can be used to Upload / Download files within your Cloud Service Provider.

# Prerequisite
Create ~/.aws/credetials and ~/.aws/config files with your corresponding profiles.

`~/.aws/config`
```
[profile sandbox1]
region = us-west-1

[profile sandbox2]
region = us-west-2

[profile sandbox3]
region = us-east-1
```

`~/.aws/credentials`
```
[sandbox1]
aws_access_key_id = 
aws_secret_access_key =
region = us-west-1

[sandbox2]
aws_access_key_id =
aws_secret_access_key =
region = us-west-2

[sandbox3]
aws_access_key_id =
aws_secret_access_key =
region = us-east-1
```

# Usage
* Upload: node src/index.mjs -a cp -p resource/sample.jpg
* Download: node src/index.mjs -a get -p sample.jpg/sample.jpg