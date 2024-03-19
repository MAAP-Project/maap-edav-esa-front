#!/bin/sh

# COPYRIGHT: EUMETSAT 2018
# LICENSE: PROPRIETARY
# PROJECT: WMS
#
# All information contained herein is, and remains the property of EUMETSAT.
# Dissemination of this information or reproduction of this material is
# strictly forbidden unless prior written permission is obtained from
# EUMETSAT.

set -e

/usr/local/bin/confd -onetime -backend env

nginx -g 'daemon off;'
