var MoscBase = function (evaluation_context_dictionary)
{
	this.eval_ctx_dict = evaluation_context_dictionary;
	this.baseObject    = {};
	this.noMoreBuild   = false;

	function emptyCheck(value, message)
	{
		if(typeof value == 'undefined' || !value){
			throw new Error(message)
		}
	}

	this.parse_properties = function (key, properties, baseObject, eval_dict)
	{
		function get_eval_string(path) {
			var eval_prop = path.match(/\*([a-zA-Z_0-9]+)\*/)[1];
			return 'eval_dict["'+eval_prop+'"]' + path.replace(/\*[a-zA-Z_0-9]+\*/, '');
		}

		var propertyBase      = {}; 
		if(properties){ 
		   baseObject[key] = baseObject[key] || {}; 
		   propertyBase         = baseObject[key];
	    }else{
	    	propertyBase = baseObject;
	    	properties = key;
	    }
		properties            = properties.split(',');
		var properties_length = properties.length;
		var property_parts    = null;

		for(var i = 0; i < properties_length; i++)
		{
			properties[i]     = properties[i].trim();
		    property_parts    = properties[i].split(':');

		    emptyCheck(property_parts[0], 'Invalid key:value pair passed');
		    emptyCheck(property_parts[1], 'Invalid key:value pair passed');

		    property_parts[0] = property_parts[0].trim();
		    var pvalue        = property_parts[1].trim();
		    if(pvalue.indexOf('*') < 0){
		    	propertyBase[property_parts[0]] = pvalue;
		    }
		    else
		    {
		    	try
		    	{
		    		propertyBase[property_parts[0]] = eval(get_eval_string(pvalue));
		    	}
		    	catch(e)
		    	{
		    		throw new Error('Context not found in eval_dict');
		    	}

		    }
			  
		} 
		return baseObject;
	}

	this.build = function (property_key, properties) 
	{

		emptyCheck(property_key, 'No prop key passed'); 
		properties = properties || null;
		this.parse_properties(property_key, properties, this.baseObject, this.eval_ctx_dict);
		return this.noMoreBuild ? this.baseObject : this;
	}

	this.buildIn = function(depth_path, properties)
	{
		emptyCheck(depth_path, 'No object path passed'); 
		var paths     = depth_path.split('.');
		var buildBase = this.baseObject;

		for( x = 0; x < paths.length; x++) 
		{
			if(buildBase[paths[x]])
			{

				//Only build when path is an object. x:'string' should fail
				if( typeof buildBase[paths[x]] == 'object' )
				{
					buildBase = buildBase[paths[x]];
				}
				else
				{
					throw new Error('Path not an object');
				}
					
			}
			else
			{
				buildBase = buildBase[paths[x]] = {};
			}
		} 
		//If properties are passed, populate new object.
		if (properties)
		{
			this.parse_properties(properties, null, buildBase, this.eval_ctx_dict);
		}
		return this.noMoreBuild ? this.baseObject : this;
	}

	this.end = function () 
	{
		this.noMoreBuild = true;
		return this.baseObject;
	}

}
module.exports = MoscBase; 