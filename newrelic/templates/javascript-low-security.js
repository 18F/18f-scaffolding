'use strict'

/**
 * New Relic agent configuration.
 *
 * See lib/config.default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: [ [Project Name] ],
  /*When "true", the agent collects performance data about your
  application and reports this data to the New Relic UI at
  newrelic.com. This global switch is normally overridden for
  each environment below.
  --18F--
  This means that the new relic will be running. You might not
  want this to run on a testing environment, so override it using
  environment variables. */
  monitor_mode: true,

  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  },

  /*When "true", the agent collects performance data about your
  application and reports this data to the New Relic UI at
  newrelic.com. This global switch is normally overridden for
  each environment below. */
  monitor_mode: true

  /*
  The Ruby Agent communicates with the New Relic service using
  SSL by default. Note that this does result in an increase in
  CPU overhead, over and above what would occur for a non SSL
  connection, to perform the encryption involved in the SSL
  communication. This work is though done in a distinct thread
  to those handling your web requests, so it should not impact
  response times. You can if you wish revert to using a non SSL
  connection, but this will result in information being sent
  over a plain socket connection and will not be as secure.*/
  ssl: true

  /*High Security Mode enforces certain security settings, and
  prevents them from being overridden, so that no sensitive data
  is sent to New Relic. Enabling High Security Mode means that
  SSL is turned on, request parameters are not collected, and SQL
  can not be sent to New Relic in its raw form. To activate High
  Security Mode, it must be set to 'true' in this local .ini
  configuration file AND be set to 'true' in the server-side
  configuration in the New Relic user interface. For details, see
  https://docs.newrelic.com/docs/subscriptions/high-security*/
  high_security: false

  /*The transaction tracer captures deep information about slow
  transactions and sends this to the UI on a periodic basis. The
  transaction tracer is enabled by default. Set this to "false"
  to turn it off.*/
  transaction_tracer.enabled: true

  /*Threshold in seconds for when to collect a transaction trace.
  When the response time of a controller action exceeds this
  threshold, a transaction trace will be recorded and sent to
  the UI. Valid values are any positive float value, or (default)
  "apdex_f", which will use the threshold for a dissatisfying
  Apdex controller action - four times the Apdex T value.*/
  transaction_tracer.transaction_threshold: apdex_f

  /*When the transaction tracer is on, SQL statements can
  optionally be recorded. The recorder has three modes, "off"
  which sends no SQL, "raw" which sends the SQL statement in its
  original form, and "obfuscated", which strips out numeric and
  string literals.*/
  transaction_tracer.record_sql: obfuscated

  /*Threshold in seconds for when to collect stack trace for a SQL
  call. In other words, when SQL statements exceed this
  threshold, then capture and send to the UI the current stack
  trace. This is helpful for pinpointing where long SQL calls
  originate from in an application.*/
  transaction_tracer.stack_trace_threshold: 0.5

  /*Determines whether the agent will capture query plans for slow
  SQL queries. Only supported in MySQL and PostgreSQL. Set this
  to "false" to turn it off.*/
  transaction_tracer.explain_enabled: true

  /*Threshold for query execution time below which query plans
  will not not be captured. Relevant only when "explain_enabled"
  is true.*/
  transaction_tracer.explain_threshold: 0.5

  /*Space separated list of function or method names in form
  'module:function' or 'module:class.function' for which
  additional function timing instrumentation will be added.*/
  transaction_tracer.function_trace:

  /*The error collector captures information about uncaught
  exceptions or logged exceptions and sends them to UI for
  viewing. The error collector is enabled by default. Set this
  to "false" to turn it off.*/
  error_collector.enabled: true

  /*To stop specific errors from reporting to the UI, set this to
  a space separated list of the Python exception type names to
  ignore. The exception name should be of the form 'module:class'.*/
  error_collector.ignore_errors:

  /*Browser monitoring is the Real User Monitoring feature of the UI.
  For those Python web frameworks that are supported, this
  setting enables the auto-insertion of the browser monitoring
  JavaScript fragments.*/
  browser_monitoring.auto_instrument: true

  /*A thread profiling session can be scheduled via the UI when
  this option is enabled. The thread profiler will periodically
  capture a snapshot of the call stack for each active thread in
  the application to construct a statistically representative
  call tree.*/
  thread_profiler.enabled: true
}
