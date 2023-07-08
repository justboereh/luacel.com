import {
    Architecture,
    CreateFunctionCommand,
    CreateFunctionUrlConfigCommand,
    AddPermissionCommand,
    GetFunctionCommand,
    LambdaClient,
    PackageType,
    Runtime,
} from '@aws-sdk/client-lambda'

export type RegionArnArgs = {
    arn: string
    region: string
}

export type CreateFunctionArgs = {
    name: string
    memory: number
    timeout: number
    region?: string
    code: Uint8Array
}

export const CreateFunction = ({
    name,
    code,
    region,
    memory,
    timeout,
}: CreateFunctionArgs) => {
    const client = new LambdaClient(region)

    const command = new CreateFunctionCommand({
        Code: { ZipFile: code },
        FunctionName: name,
        Role: process.env.AWS_ROLE_ARN,
        Architectures: [Architecture.x86_64],
        Handler: 'function.handler',
        PackageType: PackageType.Zip,
        Runtime: Runtime.provided,
        Layers: [process.env.AWS_LAYER_ARN],
        Timeout: timeout,
        MemorySize: memory,
    })

    return client.send(command)
}

export const CreateFunctionUrl = ({ arn, region }: RegionArnArgs) => {
    const command = new CreateFunctionUrlConfigCommand({
        FunctionName: arn,
        AuthType: 'NONE',
        Cors: {
            AllowCredentials: true,
            AllowHeaders: ['*'],
            AllowMethods: ['*'],
            AllowOrigins: ['*'],
            ExposeHeaders: ['*'],
        },
        InvokeMode: 'BUFFERED',
    })

    return new LambdaClient(region).send(command)
}

export const AddPermission = ({ arn, region }: RegionArnArgs) => {
    const command = new AddPermissionCommand({
        FunctionName: arn,
        FunctionUrlAuthType: 'NONE',
        StatementId: 'FunctionURLAllowPublicAccess',
        Action: 'lambda:InvokeFunctionUrl',
        Principal: '*',
    })

    return new LambdaClient(region).send(command)
}

export type GetFunctionArgs = {
    name: string
    region: string
}

export const GetFunction = ({ name, region }: GetFunctionArgs) => {
    const client = new LambdaClient(region)

    const command = new GetFunctionCommand({
        FunctionName: name,
    })

    return client.send(command)
}
