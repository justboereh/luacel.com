import { curry, defaultTo } from 'ramda'
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

const orDefaultRegion = defaultTo('us-east-1')
const createClientRegion = curry(
    (region: any, ClientConstructor: typeof LambdaClient) =>
        new ClientConstructor({ region: orDefaultRegion(region) })
)

const CreateClient = (region?: string) => {
    const createClientDefaultRegion = createClientRegion(region)

    return createClientDefaultRegion(LambdaClient)
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
    const client = CreateClient(region)

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

export const CreateFunctionUrl = ({
    arn,
    region,
}: {
    arn: string
    region?: string
}) => {
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

    return CreateClient(region).send(command)
}

export const AddPermission = ({
    arn,
    region,
}: {
    arn: string
    region?: string
}) => {
    const command = new AddPermissionCommand({
        FunctionName: arn,
        FunctionUrlAuthType: 'NONE',
        StatementId: 'FunctionURLAllowPublicAccess',
        Action: 'lambda:InvokeFunctionUrl',
        Principal: '*',
    })

    return CreateClient(region).send(command)
}

export type GetFunctionArgs = {
    name: string
    region?: string
}

export const GetFunction = ({ name, region }: GetFunctionArgs) => {
    const client = CreateClient(region)

    const command = new GetFunctionCommand({
        FunctionName: name,
    })

    return client.send(command)
}
