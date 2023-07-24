import {
    Architecture,
    CreateFunctionCommand,
    CreateFunctionUrlConfigCommand,
    AddPermissionCommand,
    GetFunctionCommand,
    LambdaClient,
    PackageType,
    Runtime,
    DeleteFunctionCommand,
    ListLayerVersionsCommand,
} from '@aws-sdk/client-lambda'
import { LambdaInsightsLayerARN } from 'assets/scripts/misc/lambda'

export type RegionArnArgs = {
    arn: string
    region: string
}

export type CreateFunctionArgs = {
    name: string
    memory: number
    timeout: number
    region: string
    code: Uint8Array
}

export const GetLuambdaVersion = (region: string) => {
    const client = new LambdaClient({ region })

    const command = new ListLayerVersionsCommand({
        LayerName: 'Luambda',
    })

    return client.send(command)
}
export const CreateFunction = async ({
    name,
    code,
    region,
    memory,
    timeout,
}: CreateFunctionArgs) => {
    const client = new LambdaClient({
        region: region,
    })

    const listLuambdaVersionsCmd = new ListLayerVersionsCommand({
        LayerName: 'Luambda',
    })

    let { LayerVersions } = await client.send(listLuambdaVersionsCmd)

    // prettier-ignore
    if (!LayerVersions || !LayerVersions[0] || !LayerVersions[0].LayerVersionArn) {
        LayerVersions = [{
            LayerVersionArn : '',
        }]
    }

    const command = new CreateFunctionCommand({
        Code: { ZipFile: code },
        FunctionName: name,
        Role: process.env.AWS_ROLE_ARN,
        Architectures: [Architecture.x86_64],
        Handler: 'function.handler',
        PackageType: PackageType.Zip,
        Runtime: Runtime.provided,
        Layers: [
            LayerVersions[0].LayerVersionArn as string,
            LambdaInsightsLayerARN[region],
        ],
        Timeout: timeout,
        MemorySize: memory,
    })

    return client.send(command)
}

export const CreateFunctionUrl = ({ arn, region }: RegionArnArgs) => {
    const client = new LambdaClient({
        region: region,
    })
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

    return client.send(command)
}

export const AddPermission = ({ arn, region }: RegionArnArgs) => {
    const client = new LambdaClient({
        region: region,
    })

    const command = new AddPermissionCommand({
        FunctionName: arn,
        FunctionUrlAuthType: 'NONE',
        StatementId: 'FunctionURLAllowPublicAccess',
        Action: 'lambda:InvokeFunctionUrl',
        Principal: '*',
    })

    return client.send(command)
}

export type GetFunctionArgs = {
    name: string
    region: string
}

export const GetFunction = ({ name, region }: GetFunctionArgs) => {
    const client = new LambdaClient({
        region: region,
    })

    const command = new GetFunctionCommand({
        FunctionName: name,
    })

    return client.send(command)
}

export type DeleteFunctionArgs = {
    name: string
    region: string
}

export const DeleteFunction = ({ name, region }: DeleteFunctionArgs) => {
    const client = new LambdaClient({
        region: region,
    })

    const command = new DeleteFunctionCommand({
        FunctionName: name,
    })

    return client.send(command)
}
