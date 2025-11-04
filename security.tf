# Security List for allowing HTTP/HTTPS and SSH traffic
# This file creates the necessary firewall rules for your VM

resource "oci_core_security_list" "web_security_list" {
  compartment_id = var.compartment_ocid
  vcn_id         = data.oci_core_subnet.subnet.vcn_id
  display_name   = "web-security-list"

  # Egress Rules (Outbound) - Allow all outbound traffic
  egress_security_rules {
    protocol    = "all"
    destination = "0.0.0.0/0"
    description = "Allow all outbound traffic"
  }

  # Ingress Rules (Inbound)
  
  # Allow SSH (port 22)
  ingress_security_rules {
    protocol    = "6" # TCP
    source      = "0.0.0.0/0"
    description = "Allow SSH from anywhere"
    
    tcp_options {
      min = 22
      max = 22
    }
  }

  # Allow HTTP (port 80)
  ingress_security_rules {
    protocol    = "6" # TCP
    source      = "0.0.0.0/0"
    description = "Allow HTTP from anywhere"
    
    tcp_options {
      min = 80
      max = 80
    }
  }

  # Allow HTTPS (port 443)
  ingress_security_rules {
    protocol    = "6" # TCP
    source      = "0.0.0.0/0"
    description = "Allow HTTPS from anywhere"
    
    tcp_options {
      min = 443
      max = 443
    }
  }

  # Allow ICMP (ping)
  ingress_security_rules {
    protocol    = "1" # ICMP
    source      = "0.0.0.0/0"
    description = "Allow ICMP for ping"
  }
}

# Get subnet information to retrieve VCN ID
data "oci_core_subnet" "subnet" {
  subnet_id = var.subnet_id
}

# Output the security list ID for reference
output "security_list_id" {
  value       = oci_core_security_list.web_security_list.id
  description = "The OCID of the created security list"
}
