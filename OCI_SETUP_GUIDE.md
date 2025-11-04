# OCI Private Key Setup Guide

## ❌ Current Error

You're seeing this error:
```
Error: can not create client, bad configuration: did not find a proper configuration for private key
```

This means your `OCI_PRIVATE_KEY` GitHub Secret is either:
1. Not set
2. In the wrong format
3. Has extra characters or missing newlines

---

## ✅ How to Fix It

### Step 1: Get Your OCI Private Key

Your OCI private key should look like this:

```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA... (many lines of base64 text)
...
...
-----END RSA PRIVATE KEY-----
```

Or like this (newer format):

```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC... (many lines)
...
...
-----END PRIVATE KEY-----
```

### Step 2: Add It to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `OCI_PRIVATE_KEY`
5. Value: **Paste the ENTIRE key including the BEGIN and END lines**
6. Click **Add secret**

### Step 3: Verify Other OCI Secrets Are Set

Make sure these secrets are also configured:

- ✅ `OCI_TENANCY_OCID` - Your OCI tenancy OCID
- ✅ `OCI_USER_OCID` - Your OCI user OCID  
- ✅ `OCI_FINGERPRINT` - Your API key fingerprint (format: `aa:bb:cc:dd:ee:ff:...`)
- ✅ `OCI_REGION` - Your region (e.g., `us-ashburn-1`, `sa-saopaulo-1`)
- ✅ `OCI_COMPARTMENT_OCID` - Your compartment OCID
- ✅ `OCI_SUBNET_ID` - Your subnet OCID
- ✅ `OCI_AVAILABILITY_DOMAIN` - Your availability domain (e.g., `AD-1`)
- ✅ `OCI_UBUNTU_IMAGE_OCID` - Ubuntu 22.04 image OCID for your region

---

## 🔍 How to Find Your OCI Configuration

### 1. Private Key Location
Your private key is usually stored at:
- **macOS/Linux**: `~/.oci/oci_api_key.pem`
- **Windows**: `C:\Users\<YourUsername>\.oci\oci_api_key.pem`

To view it:
```bash
cat ~/.oci/oci_api_key.pem
```

### 2. Get Your OCI Configuration Values

Check your OCI config file:
```bash
cat ~/.oci/config
```

It should show:
```
[DEFAULT]
user=ocid1.user.oc1..aaaa...
fingerprint=aa:bb:cc:dd:ee:ff:...
key_file=~/.oci/oci_api_key.pem
tenancy=ocid1.tenancy.oc1..aaaa...
region=us-ashburn-1
```

### 3. Find Image OCID

For Ubuntu 22.04 in your region, go to:
1. OCI Console → Compute → Images
2. Filter by: OS = "Canonical Ubuntu", Version = "22.04"
3. Copy the OCID

Or use this command:
```bash
oci compute image list \
  --compartment-id <your-compartment-ocid> \
  --operating-system "Canonical Ubuntu" \
  --operating-system-version "22.04" \
  --shape "VM.Standard.E3.Flex" \
  --query "data[0].id" \
  --raw-output
```

---

## ⚠️ Common Mistakes

### ❌ Wrong: Copying with extra spaces
```
    -----BEGIN RSA PRIVATE KEY-----
    MIIEpAI...
```

### ✅ Correct: Clean copy with no leading spaces
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAI...
```

### ❌ Wrong: Missing BEGIN/END lines
```
MIIEpAIBAAKCAQEA...
```

### ✅ Correct: Complete key with headers
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAI...
-----END RSA PRIVATE KEY-----
```

---

## 🧪 Test Your Configuration Locally

Before pushing to GitHub, test locally:

```bash
# Set environment variables
export TF_VAR_tenancy_ocid="ocid1.tenancy..."
export TF_VAR_user_ocid="ocid1.user..."
export TF_VAR_fingerprint="aa:bb:cc:..."
export TF_VAR_private_key_path="~/.oci/oci_api_key.pem"
export TF_VAR_region="us-ashburn-1"
export TF_VAR_compartment_ocid="ocid1.compartment..."
export TF_VAR_subnet_id="ocid1.subnet..."
export TF_VAR_availability_domain="AD-1"
export TF_VAR_ubuntu_2204_image_ocid="ocid1.image..."
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_rsa.pub)"

# Test Terraform
terraform init
terraform plan
```

If this works locally, your configuration is correct!

---

## 📝 Quick Checklist

- [ ] OCI private key is in PEM format with BEGIN/END lines
- [ ] Private key has NO leading spaces or tabs
- [ ] Private key has proper newlines (multi-line)
- [ ] All OCI secrets are set in GitHub
- [ ] Fingerprint matches the private key
- [ ] Region matches your OCI setup
- [ ] Subnet and compartment OCIDs are correct

---

## 🆘 Still Having Issues?

1. **Verify key format**:
   ```bash
   head -n1 ~/.oci/oci_api_key.pem
   # Should output: -----BEGIN RSA PRIVATE KEY----- or -----BEGIN PRIVATE KEY-----
   ```

2. **Regenerate API key** in OCI Console:
   - Identity → Users → Your User → API Keys
   - Add API Key → Generate API Key Pair
   - Download private key and note the fingerprint

3. **Check GitHub Actions logs** for the new verification steps that show:
   - Whether the key file was created
   - What the key type is
   - Any format issues

---

After setting up all secrets correctly, commit and push your changes to trigger the workflow again!
