# Configure the AWS Provider
provider "aws" {
  region  = "eu-north-1"
}



resource "aws_security_group" "video_app_sg" {
  name        = "video_app_sg"

  ingress {
    description = "Allow Inbound HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow Inbound HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

ingress {
    description = "Allow app"
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "video-app-sg"
  }
  
}

resource "aws_instance" "video_app" {
  ami           = "ami-07c8c1b18ca66bb07" 
  instance_type = "t3.micro"
  tags = {
    Name = "video-app"
  }
    vpc_security_group_ids = [aws_security_group.video_app_sg.id]

key_name = "UK-Olena-mbp"

}
