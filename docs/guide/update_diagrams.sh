#!/bin/sh
java -jar ./plugins/plantuml.1.2020.19.jar -png -r \
  ./functional_spec/entities \
  ./functional_spec/state_flows \
  ./technical_spec/technical_overview \
  ./technical_spec/integration_scenarios