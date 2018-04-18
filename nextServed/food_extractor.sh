#!/bin/sh
# This extracts all the food elements in the meals, removed the RFH text and saves the results
# in a file that has the food items sorted and unique...ish
$ grep -hoP '(?<=<li>).*?(?=</li>)' ./menu/* | sed "s/(RFH.*)$//g" |sort --unique > ../foods.txt
