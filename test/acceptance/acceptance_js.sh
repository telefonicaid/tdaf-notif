#!/bin/bash
# sh file to execute acceptance tests based in the 
############################ acceptance.js.sh file version#######
# To run script use ./test.acceptance.sh test_suite environment #
#################################################################

## Get params
#Check parameters
if [ "$1" = "" ] || [ "$2" = "" ];
then
  echo "acceptance.js.sh: Script for executing Acceptance Tests in JavaScript"
  echo "acceptance.js.sh test_suite environment"
  echo "  params:"
  echo "    test_suite: scope of the test. Values available: all, comp, int, e2e"
  echo "    environment: local or other"

fi

TEST_SUITE="all"
if [ "$1" = "all" ] || [ "$1" = "comp" ] || [ "$1" = "int" ] || [ "$1" = "e2e" ];
then
  TEST_SUITE=$1
fi 

ENVIRONMENT="local"
if [ "$2" != "" ] 
then
  ENVIRONMENT=$2
fi 

#!/bin/sh

#Check if environment configuration is available
if [ ! -f "./settings/env.$2.config.js" ];
then
  echo "acceptance.js.sh: Environment Configuration File does not exist: ./settings/env.$2.config.js"
  exit -1
else
  cp "./settings/env.$2.config.js" ./config.environment.js
fi

#Showing the current execution parameters
echo "acceptance.js.sh: Starting '$TEST_SUITE' Tests in '$ENVIRONMENT'"

#Check if node packages for testing has been installed
if [ ! -d "./node_modules" ];
then
  echo "acceptance.js.sh: Installing needed node packages for Testing"	
  npm install
  echo "acceptance.js.sh: Node packages for Testing Installed"
fi

# Check Component Test Execution
if [ "$TEST_SUITE" = "all" ] || [ "$TEST_SUITE" = "comp" ];
then
  #Check if Component Tests Exists
  if [ -d "./component" ] && [ -f "./component.sh" ];
  then
  	echo "acceptance.js.sh: Starting Component Tests Execution..."
	  ./component.sh $ENVIRONMENT
	  echo "acceptance.js.sh: Component Tests Execution Finished"
  else
  	echo "acceptance.js.sh: Component Test Skipped..."
  fi
fi
# Check Integration Test Execution
if [ "$TEST_SUITE" = "all" ] || [ "$TEST_SUITE" = "int" ];
then
  if [ -d "./integration" ] && [ -f "./integration.sh" ];
  then
	  echo "acceptance.js.sh: Starting Integration Tests Execution..."
	  ./integration.sh $ENVIRONMENT
	  echo "acceptance.js.sh: Integration Tests Execution Finished..."	
  else
  	echo "acceptance.js.sh: Integration Tests Skipped..."
  fi
fi

# Check Integration Test Execution
if [ "$TEST_SUITE" = "all" ] || [ "$TEST_SUITE" = "e2e" ];
then
  if [ -d "./e2e" ] && [ -f "./e2e.sh" ];
  then
	  echo "acceptance.js.sh: Starting e2e Tests Execution..."
	  ./e2e.sh
	  echo "acceptance.js.sh: e2e Tests Execution Finished..."	
  else
  	echo "acceptance.js.sh: e2e Tests Skipped..."
	pwd
  fi
fi



