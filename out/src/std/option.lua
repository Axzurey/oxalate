-- Compiled with roblox-ts v2.1.1
local TS = _G[script]
local _result = TS.import(script, script.Parent, "result")
local Err = _result.Err
local Ok = _result.Ok
--[[
	*
	* cmon, this seemed like it would be fun c:
	* Though we don't have the "?" syntax or the same pattern matching we can still have fun with unwrapping
]]
local Some, None
local Option
do
	Option = setmetatable({}, {
		__tostring = function()
			return "Option"
		end,
	})
	Option.__index = Option
	function Option.new(...)
		local self = setmetatable({}, Option)
		return self:constructor(...) or self
	end
	function Option:constructor(value)
		self.value = value;
		(getmetatable(self)).__eq = function(a, b)
			if a.value ~= nil and b.value ~= nil then
				if a.value == b.value then
					return true
				end
			elseif a.value == nil and b.value == nil then
				return true
			end
			return false
		end
		(getmetatable(self)).__tostring = function(a)
			return "Option[" .. (tostring(a.value) .. "]")
		end
	end
	function Option:is_some()
		return self.value ~= nil
	end
	function Option:is_none()
		return self.value == nil
	end
	function Option:unwrap()
		local _arg0 = self.value ~= nil
		assert(_arg0, "Attempt to unwrap an Option with a null value.")
		return self.value
	end
	function Option:expect(message)
		local _arg0 = self.value ~= nil
		local _message = message
		assert(_arg0, _message)
		return self.value
	end
	function Option:map(operation)
		if self:is_some() then
			return Some(operation(self.value))
		else
			return None()
		end
	end
	function Option:unwrap_or(default_value)
		if self.value == nil then
			return default_value
		end
		return self.value
	end
	function Option:unwrap_or_else(default_function)
		if self.value == nil then
			return default_function()
		end
		return self.value
	end
	function Option:ok_or(err)
		if self:is_some() then
			return Ok(self.value)
		else
			return Err(err)
		end
	end
end
local function wrap(value)
	if value == nil then
		return None()
	end
	return Some(value)
end
function Some(value)
	return Option.new(value)
end
function None()
	return Option.new()
end
return {
	wrap = wrap,
	Some = Some,
	None = None,
	Option = Option,
}
