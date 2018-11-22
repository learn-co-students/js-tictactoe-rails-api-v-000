ActiveModelSerializers.config.tap do |c|

  c.adapter = :json_api
  c.jsonapi_include_toplevel_object = true
  c.jsonapi_version = "1.0"

end

# This tells AMS to use the :json_api serialization adapter, to include a top-level  # object, and to adhere to v1.0 of the JSON:API specification. For some reason, AMS's # default :json_api configuration does not include a top-level object, despite the 
# JSON:API specification's insistence on a top-level object called "data".