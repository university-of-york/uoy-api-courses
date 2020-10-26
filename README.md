# Courses API

This is the University of York Courses API. Consumers can search for and retrieve a list of courses that are published on the 
[University of York website](https://www.york.ac.uk), with results ordered by relevance.

The data is sourced from the University's instance of [Funnelback](https://www.funnelback.com/home), a search provider which handles 
the indexing of the course web pages into a data collection and the subsequent querying of this collection. See the 
[related repo](https://github.com/university-of-york/uoy-config-funnelback-courses) for more information.

## Course Search

The API has been primarily written as a data source for the [Course Search](https://github.com/university-of-york/uoy-app-course-search) application. For more context on this system, you can view the [system architecture and architecture decision log](https://github.com/university-of-york/uoy-app-course-search/wiki).

## Related Repos

- [Course Search](https://github.com/university-of-york/uoy-app-course-search) - the user-facing Course Search application on the University of York website.
- [Funnelback Courses API](https://github.com/university-of-york/uoy-config-funnelback-courses) - the underlying Funnelback search provider configuration that powers searches.

## Consuming the API

The Courses API is available at [https://api.v1.courses.app.york.ac.uk/courses](https://api.v1.courses.app.york.ac.uk/courses).

You can view the [API specification](https://university-of-york.github.io/uoy-api-courses/) for a description of endpoints and parameters.

The latest version of the Courses API specification is published and kept up-to-date automatically. It is defined using the [OpenAPI specification](https://swagger.io/docs/specification/about/) and is served as a static site using a distribution of [Swagger-UI](https://github.com/swagger-api/swagger-ui/tree/master/dist).

## Error handling and logs
Exceptions caught in the application are logged. These can be found in CloudWatch. As an ESG AWS user for the relevant environment, or 
as your own user id if the application is running in your AWS sandbox, open CloudWatch from the AWS Management console and 
click on `Log groups`. The group name is `/aws/lambda/uoy-courses-api-v1-courses`.

Something similar to the following will be returned via the API

```{
 "timestamp": "2020-10-19T09:59:36.872Z",
 "status": 500,
 "error": "Internal Server Error",
 "message": "An error has occurred..",
 "path": "/courses"
 }
```
 
## Development

The API is hosted in AWS API Gateway, and deployed using the [Serverless](https://www.serverless.com/) framework.

### Prerequisites

You will need:

- [Node.js](https://nodejs.org/en/download/) (LTS version) installed on your machine
- An AWS account (we recommend using `saml2aws` to authenticate locally, check [our wiki page](https://wiki.york.ac.uk/display/AWS/2.+Command+Line+Access) for more details)

You will also need to add an `AWS_ACCOUNT_ID` environment variable with the value set as the ID of your AWS account.

### Local Development

To set up the project for local development, at the root directory run:

```
npm install
```

To deploy the application to your account, login to AWS (e.g. `saml2aws login`) then run:

```
npm run deploy
```

Then find the API's URL in AWS API Gateway under the appropriate Stage to try it out.

To undeploy the application from your account, run:

```
npm run undeploy
```

### Testing

To run the tests locally run:

```
npm test
```

Tests are run automatically upon creation of a pull request, configured in `.github/workflows/checks.yml`, 
and upon a merge into `dev` or `main` branches on Github as part of `.github/workflows/deploy.yml`

### Deployment

Deployment to the development and production environments happen through GitHub actions that trigger automatically when 
new code is merged into the `dev` and `main` branches. 

The development version of the Courses API is available at [https://api.v1.courses.dev.app.york.ac.uk/courses](https://api.v1.courses.dev.app.york.ac.uk/courses).

### Code style

The project defines rules for code formatting and style. Code is checked against these
rules upon creation of a pull request, configured in `.github/workflows/checks.yml`, 
and upon a merge into `dev` or `main` branches on Github as part of `.github/workflows/deploy.yml`

#### Formatting

This project uses [prettier](https://prettier.io/) to format code and to check that code
is correctly formatted. Overrides to its default formatting rules are agreed by the team and
configured in `.prettierrc.json` in the root folder. You can use `npm run format` to format
all code in the project.

##### Intellij

You can configure Intellij to format code, using `prettier`, when you save a file and when 
you run Intellij's formatting command (`Ctrl-Alt-L`). To do this:
* install the `prettier` plugin (under `File` > `Settings` > `Plugins`)
* go to `File` > `Settings` > `Languages & Frameworks` > `Javascript` > `Prettier` and
check the options `on save` and `on code reformat`

To make Intellij use the `prettier` formatting rules while you edit code, open
`package.json` and above the code window it will prompt you to `Use code style based on prettier for this project?`
which you can accept.

#### Linting

This project uses [XO](https://github.com/xojs/xo) to check code style. 
XO is based on [ESLint](https://eslint.org/). Overrides to default linting rules are agreed
by the team and configured in `.xo-config.json` in the root folder. You can use `npm run lint`
to check whether the code conforms to the linting rules.

### Useful commands

**`npm run test`**

Run the application's tests.

**`npm run deploy`**

Deploy the application to AWS. To deploy to your AWS sandbox, you will need to 
* be logged in to AWS using [saml2aws](https://wiki.york.ac.uk/display/AWS/2.+Command+Line+Access)
* have defined an environment variable called `AWS_ACCOUNT_ID` with the account id of your sandbox:

```
set AWS_ACCOUNT_ID=012345678
```

You can find your sandbox AWS account id by logging in to AWS either via
the web console or via saml2aws - it is displayed when you select which
account you want to use.

**`npm run undeploy`**

Remove the application from AWS.

**`npm run format`**

Format all code using the team's agreed formatting rules. This uses `prettier`.

**`npm run checkformat`**

Check all code is correctly formatted according to agreed rules. Uses `prettier`.

**`npm run lint`**

Check to see if code meets the team's agreed coding standards. This uses `XO` (which in turn uses `eslint`).

**`npm run check`**

Checks code formatting (`prettier`), checks coding standards (`XO`), then runs tests.

**`npm run formatandcheck`**

Fixes code formatting (`prettier`), checks coding standards (`XO`), then runs tests.

### Tagging of AWS resources

Most AWS resources created by this application are tagged according to the `stackTags`
setting in `serverless.yml` (which works by applying tags to the CloudFormation stack
generated by Serverless) during deployment. However, due to a [suspected bug in 
CloudFormation](https://github.com/aws/serverless-application-model/issues/1239), tags
are not automatically applied to the API and API stage resources, upon creation, because 
an OpenAPI specification is being used to generate the API.
As a workaround, we set tags on the API and stage using a bash script 
(`scripts/addAwsTagsToApi`) that runs AWS CLI tagging commands. This script is executed in
the CI/CD pipeline after deployment of the app so that the production API resources are always
tagged correctly.

## Documentation

The [customised Swagger-UI](https://university-of-york.github.io/uoy-api-courses/#/) has been set up by 
following [these instructions](https://wiki.york.ac.uk/display/ittechdocs/Hosting+API+Documentation+with+Swagger+UI).

## Contact

- [Digital Platforms and Developments Team](mailto:marketing-support@york.ac.uk)
- [Enterprise Systems Teaching and Learning Team](mailto:esg-teaching-and-learning-group@york.ac.uk)

## Licence

MIT
