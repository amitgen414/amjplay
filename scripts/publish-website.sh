#!/bin/bash
yarn build
aws s3 rm s3://amjplay.com --recursive
aws s3 sync dist s3://amjplay.com/