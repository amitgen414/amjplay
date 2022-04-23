#!/bin/bash
yarn build
aws s3 sync dist s3://amjplay.com/