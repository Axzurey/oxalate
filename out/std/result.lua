-- Compiled with roblox-ts v2.1.1
local Ok, Err
local Result
do
	Result = setmetatable({}, {
		__tostring = function()
			return "Result"
		end,
	})
	Result.__index = Result
	function Result.new(...)
		local self = setmetatable({}, Result)
		return self:constructor(...) or self
	end
	function Result:constructor(value, _is_error)
		self.value = value
		self._is_error = _is_error;
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
			return "Result[" .. (tostring(a.value) .. "]")
		end
	end
	function Result:_construct_ok(value)
		return Result.new(value, false)
	end
	function Result:_construct_err(value)
		return Result.new(value, true)
	end
	function Result:is_ok()
		return not self._is_error
	end
	function Result:is_ok_and(predicate)
		if self._is_error then
			return false
		end
		if predicate(self.value) then
			return true
		end
		return false
	end
	function Result:is_err()
		return self._is_error
	end
	function Result:is_err_and(predicate)
		if not self._is_error then
			return false
		end
		if predicate(self.value) then
			return true
		end
		return false
	end
	function Result:map(operation)
		if self:is_ok() then
			return Ok(operation(self.value))
		else
			return Err(self.value)
		end
	end
	function Result:unwrap()
		if self:is_err() then
			error(self.value)
		end
		return self.value
	end
	function Result:unwrap_err()
		if self:is_ok() then
			error("Value is not an error, but instead has a value of " .. tostring((self:unwrap())))
		end
		return self.value
	end
	function Result:unwrap_or_default(default_value)
		if self:is_err() then
			return default_value
		end
		return self.value
	end
	function Result:unwrap_or_else(default_value)
		if self:is_err() then
			return default_value(self.value)
		end
		return self.value
	end
end
function Ok(value)
	return Result:_construct_ok(value)
end
function Err(err)
	return Result:_construct_err(err)
end
return {
	Ok = Ok,
	Err = Err,
	Result = Result,
}
