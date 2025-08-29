---
id: ssh-key-setup
title: SSH Key Setup Instructions for Team Members
description: Create SSH keys and connect to EC2 and database tunnels securely
---

## Overview
This guide will help you create your own SSH key pair to access our EC2 instances and database tunnels securely.

## Step 1: Generate Your SSH Key Pair

### On macOS/Linux
```bash
# Navigate to SSH directory
cd ~/.ssh

# Generate a new RSA key pair (replace with your email)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/your-name-company-key -C "your.email@company.com"

# When prompted:
# - Enter a secure passphrase (recommended) or press Enter for no passphrase
# - Confirm the passphrase
```

### On Windows (Git Bash or WSL)
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/your-name-company-key -C "your.email@company.com"
```

## Step 2: Set Proper Permissions

```bash
# Private key (readable only by you)
chmod 600 ~/.ssh/your-name-company-key

# Public key
chmod 644 ~/.ssh/your-name-company-key.pub
```

## Step 3: Share Your Public Key

```bash
cat ~/.ssh/your-name-company-key.pub
```

Copy the ENTIRE output, e.g.:
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQ... your.email@company.com
```

Important:
- Share ONLY the public key (.pub) with the system administrator
- NEVER share your private key file
- Keep your private key secure and private

## Step 4: Admin Will Add Your Key to EC2

1. Log into the EC2 instance
2. Add your public key to `~/.ssh/authorized_keys`
3. Confirm the setup is working

## Step 5: Test Your Connection

### Basic connection test
```bash
ssh -i ~/.ssh/your-name-company-key ec2-user@ec2-3-79-100-5.eu-central-1.compute.amazonaws.com
```

### Database tunnel connection
```bash
# Check if port 5432 is already in use
lsof -i :5432

# If port is busy, kill existing connections
sudo lsof -ti:5432 | xargs kill -9

# Create database tunnel
ssh -i ~/.ssh/your-name-company-key -L 5432:trade-platform-db-instance-1.c72ww608sthc.eu-central-1.rds.amazonaws.com:5432 ec2-user@ec2-3-79-100-5.eu-central-1.compute.amazonaws.com
```

### Background tunnel (recommended for development)
```bash
ssh -i ~/.ssh/your-name-company-key -L 5432:trade-platform-db-instance-1.c72ww608sthc.eu-central-1.rds.amazonaws.com:5432 ec2-user@ec2-3-79-100-5.eu-central-1.compute.amazonaws.com -f -N

# Stop background tunnel
ps aux | grep ssh
kill [PID_OF_SSH_PROCESS]
```

## Step 6: Optional — SSH Config Setup

```bash
nano ~/.ssh/config
```

Add this configuration:
```
Host trade-platform
    HostName ec2-3-79-100-5.eu-central-1.compute.amazonaws.com
    User ec2-user
    IdentityFile ~/.ssh/your-name-company-key
    LocalForward 5432 trade-platform-db-instance-1.c72ww608sthc.eu-central-1.rds.amazonaws.com:5432
```

Now connect simply with:
```bash
ssh trade-platform
```

## Troubleshooting

1. Permission denied (publickey)
   - Your public key hasn't been added to the server yet; contact your admin

2. Address already in use on port 5432
```bash
lsof -i :5432
sudo lsof -ti:5432 | xargs kill -9
ssh -i ~/.ssh/your-name-company-key -L 5433:trade-platform-db-instance-1.c72ww608sthc.eu-central-1.rds.amazonaws.com:5432 ec2-user@ec2-3-79-100-5.eu-central-1.compute.amazonaws.com
```

3. Identity file not accessible
   - Check the file path and permissions; ensure you're using the private key (not .pub)

## Security Best Practices

1. Use a passphrase for your private key
2. Never share your private key
3. Backup keys securely
4. Use unique keys per project/company
5. Rotate keys periodically

## For System Administrators

### Add a new employee's public key to EC2
```bash
ssh -i ~/.ssh/admin-key ec2-user@ec2-3-79-100-5.eu-central-1.compute.amazonaws.com
echo "ssh-rsa AAAAB3NzaC1yc2E... employee.email@company.com" >> ~/.ssh/authorized_keys
cat ~/.ssh/authorized_keys
```

### Remove employee access
```bash
nano ~/.ssh/authorized_keys
sed -i '/employee.email@company.com/d' ~/.ssh/authorized_keys
```

## Database Connection Details

- Host: `localhost`
- Port: `5432` (or the forwarded port)
- Database: `trade_platform`
- Username: `postgres`
- Password: `[provided separately]`

