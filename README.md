### Scrape Town List

`cd scripts`
`node get-towns.js`

### Terraform Setup (Mac)

`brew tap hashicorp/tap`
`brew install hashicorp/tap/terraform`

### AWS setup

1. Get terraform.tfvars from other dev and & put in `/environment/dev`
1. Setup AWS creds
    1. Get token & secret from other dev
    1. `vi ~/.aws/credentials` (you may need to `mkdir ~/.aws` first if it fails)
    1. c/p the following into `~/.aws/credentials` & replace 'token' and 'secret' with the real values

    ```
    [elections]
    aws_access_key_id = token
    aws_secret_access_key = secret
    ```
1. Confirm it works by running `terraform plan` and `terraform apply`

### Setup python venv

1. Create the virtual environment in the `src` directory

```
cd src
python3 -m venv election_venv
```

2. Go back to root and setup [autoenv](https://github.com/hyperupcall/autoenv)

    1. Navigate to root and download
    ```
    cd ..
    curl -#fLo- 'https://raw.githubusercontent.com/hyperupcall/autoenv/master/scripts/install.sh' | sh
    ```
    2. Run whatever `source` command the install output tells you to run
    3. Enable disable venv on leave
    ```
    echo "export AUTOENV_ENABLE_LEAVE=true" >> ~/.zshrc
    ```

    4. `source ~/.zshrc`
    5. Check if it works by running `cd src`
        1. It'll ask you to allow the new `source`, say yes
        1. You should (hopefully) now be in the venv, if it worked right you should see something like the following in your terminal
        ```
        (election_venv) mayanigrin@Mayas-MacBook-Pro src % 
        ```
    6. Confirm that the deactivate works as well by running `cd ..`
        1. It'll ask you to allow the new `source`, say yes
        1. You should (hopefully) now have left the venv, if it worked right you should no longer see the `(election_venv)` prefix on your cli 
        
