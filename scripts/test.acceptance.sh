#!/bin/bash
# sh file to execute the files based on configuration file
# To run script edit acceptance.cfg and type ./test.acceptance.sh or direct use ./test.acceptance.sh test_suite environment to override config

. ../config/test.acceptance.cfg

cd ../test/acceptance
rm -rf testreport/*.xml
mkdir -p logs


#Check parameters
if ([ "$1" = "" ])&&(([ "$test_suite" != "all" ] && [ "$test_suite" != "comp" ] && [ "$test_suite" != "int" ] && [ "$test_suite" != "e2e" ])||[ "$environment" = "" ])
   	then
    		echo "Test.acceptance.sh error: Bad config file"
    		echo "Edit test.acceptance.sh in conf/"
   		echo "  params:"
   		echo "    test_suite: Scope of the test. Values available: [all, comp, int, e2e]"
   		echo "    environment: local or other"
   		exit $?
else
	if (([ "$1" != "" ]&&([ "$1" != "all" ] && [ "$1" != "comp" ] && [ "$1" != "int" ] && [ "$1" != "e2e" ]))||([ "$1" != "" ]&&[ "$2" = "" ])||[ "$3" != "" ])
	then
		echo "Test.acceptance.sh error: Bad usage of script"
 		echo "./test.acceptance.sh test_suite environment"
		echo "  params:"
		echo "    test_suite: Scope of the test. Values available: [all, comp, int, e2e]"
		echo "    environment: local or other"
  		exit $?
	fi
fi

echo "Running acceptance "

if [ "$1" != "" ]&&[ "$2" != "" ]
then
	echo "Running acceptance test with testsuite $1 and environment $2..."
	./acceptance*.sh $1 $2 >logs/acceptance.log 2>&1
else
	echo "Running acceptance test with testsuite $test_suite and environment $environment..."
	./acceptance*.sh $test_suite $environment >logs/acceptance.log 2>&1
fi

echo "The test suite finished with status $?, check ../test/acceptance/logs/acceptance.log for detailed status "

exit $?
