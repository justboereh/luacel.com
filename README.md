# Luacel.com

The Way to Deploy Lua Codes.

<br />
<br />
<br />
<br />

## Enviroment Variables

### `DATABASE_URL`

For the database interacting. Get this [variable](https://planetscale.com) by signing up for an account at PlanetScale and creating a project.

### `JWT_KEY`

A secret key for encoding and decoding JWT tokens. Anything should be fine.

### `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`

For interacting with any [AWS services](https://console.aws.amazon.com/iamv2/home#/security_credentials). It is a better idea to have two pair of keys for Lambda and Cloudwatch, but in this project I would be using only one pair.

### `AWS_ROLE_ARN`

For interacting directly with Lambda. Specifically used for creating Lambda Functions. Get the [variable here](https://console.aws.amazon.com/iamv2/home#/roles)