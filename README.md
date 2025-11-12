### Scrape Town List

`cd scripts`
`node get-towns.js`

### Terraform Setup (Mac)

`brew tap hashicorp/tap`
`brew install hashicorp/tap/terraform`

### AWS setup

1. Get terraform.tfvars from other dev and & put in `/environments/dev/node-api`
2. Setup AWS creds

    1. Get token & secret from other dev
    2. `vi ~/.aws/credentials` (you may need to `mkdir ~/.aws` first if it fails)
    3. c/p the following into `~/.aws/credentials` & replace 'token' and 'secret' with the real values

    ```
    [elections]
    aws_access_key_id = token
    aws_secret_access_key = secret
    ```
    
4. Confirm it works by running `terraform plan` 

### Services
- [Admin Front End](#admin-front-end)
- [Candidate Front End](#candidate-front-end)
- [Node API](#node-api)     

### Admin Front End
**Installation And Running**
``cd /src/admin``
``npm install``
``npm run start``

**Deployment**
``cd /src/admin``
``npm run build``
``cd /environments/dev/admin-website``
Run ``terraform plan``, and make sure the changes look right
If they do ``terraform apply``

### Candidate Front End
**Installation And Running**
``cd /src/website``
``npm install``
``npm run dev``

**Deployment**
``cd /src/website``
``npm run build``
``cd /environments/dev/website``
Run ``terraform plan``, and make sure the changes look right
If they do ``terraform apply``

### Node Api
**Installation And Running**
``cd /src/node-api``
``npm install``
Get JWT info & DB creds one of two ways:
1. get AWS access from another dev & view them in SecretsManager, 
1. get them from the .env file from another dev
Copy the ``.env.example`` file to ``.env`` and fill in your local variables from the step above
Copy  `config/config.template.json`, rename to `config/config.json`, and fill in all of the placeholders
Run ``npm run dev`` and the server should be started

**DB Migrations** 
- ``npx sequelize-cli migration:generate --name migration-example``
- Then run ``npm run migration`` and copy the output to the migration file created above
- Check it over, as that migration generator is still in development
- When your confident the changes are accurate run ``npx sequelize-cli db:migrate``
- To run the migration in production, run ``NODE_ENV=production npx sequelize-cli db:migrate``

**Deployment**
``cd /environments/dev/node-api``
Run ``terraform plan``, and make sure the changes look right
If they do ``terraform apply``

### Dev workflow

Here's some general guidelines for contributing

1. **Create issue**

   If one doesn't already exist, create github issue with description of job-to-be-done and set its issue type:
    - **Bug** for fixing errors or buggy behavior
    - **Feature** for new functionality or UI
    - **Task** for non-user-impacting changes

    If you're planning on implementing the changes, assign the issue to yourself. 

2. **Create branch for job-to-be-done(s)**

   On your local, create a new branch w/ naming convention `NAME/ISSUENUM-DESCRIPTION-OF-CHANGES` (e.g. `jerry/21-add-error-toasts`)
   Use your judgement regarding batching changes, but for larger / more complicated JTBD it's probably best to tackle each in their own branch

   _Note: feel free to push incremental commits if you'd like, but it's not a hard requirement__ 

3. **Create PR**

   Once ready, push changes and open a PR comparing your branch against main. In the description, link the issue name & summarize the code changes -- can be brief. Code review isn't required. If you really want another pair of eyes, request review via github & some other comms channel in case they don't have github notifications

4. **Merge PR & Deploy**

   When you're ready to deploy, merge your changes into main. Checkout main on your local and pull, and then follow the instructions above to deploy
