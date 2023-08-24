-- Compiled with roblox-ts v2.1.1
local TS = _G[script]
local slice_array = TS.import(script, script.Parent, "fnutils").slice_array
local _option = TS.import(script, script.Parent, "option")
local None = _option.None
local Some = _option.Some
local Ok = TS.import(script, script.Parent, "result").Ok
local RIterator
do
	RIterator = setmetatable({}, {
		__tostring = function()
			return "RIterator"
		end,
	})
	RIterator.__index = RIterator
	function RIterator.new(...)
		local self = setmetatable({}, RIterator)
		return self:constructor(...) or self
	end
	function RIterator:constructor(values)
		self.values = values
		self.internal_counter = 0
	end
	function RIterator:from(into_iter)
		return RIterator.new(into_iter)
	end
	function RIterator:from_riter(iter)
		local _array = {}
		local _length = #_array
		local _array_1 = iter.values
		table.move(_array_1, 1, #_array_1, _length + 1, _array)
		return RIterator.new(_array)
	end
	function RIterator:next()
		if self.internal_counter < #self.values then
			local out = Some(self.values[self.internal_counter + 1])
			self.internal_counter += 1
			return out
		end
		return None()
	end
	function RIterator:peek()
		if self.internal_counter < #self.values then
			return Some(self.values[self.internal_counter + 1])
		end
		return None()
	end
	function RIterator:size_hint()
		return #self.values - self.internal_counter
	end
	function RIterator:length()
		return #self.values
	end
	function RIterator:nth(n)
		if n < 0 and -n >= #self.values then
			return None()
		end
		if n >= #self.values then
			return None()
		end
		if n >= 0 then
			return Some(self.values[n + 1])
		else
			return Some(self.values[#self.values + n + 1])
		end
	end
	function RIterator:chain(iterator)
		local _fn = RIterator
		local _array = {}
		local _length = #_array
		local _array_1 = self.values
		local _Length = #_array_1
		table.move(_array_1, 1, _Length, _length + 1, _array)
		_length += _Length
		local _array_2 = iterator.values
		table.move(_array_2, 1, #_array_2, _length + 1, _array)
		return _fn:from(_array)
	end
	function RIterator:map(f)
		local _values = self.values
		local _arg0 = function(e)
			return f(e)
		end
		-- ▼ ReadonlyArray.map ▼
		local _newValue = table.create(#_values)
		for _k, _v in _values do
			_newValue[_k] = _arg0(_v, _k - 1, _values)
		end
		-- ▲ ReadonlyArray.map ▲
		local mapped = _newValue
		return RIterator:from(mapped)
	end
	function RIterator:take(n)
		if n + self.internal_counter >= #self.values then
			local slice = slice_array(self.values, n)
			return slice:map(function(v)
				return RIterator:from(v)
			end)
		end
		local c = {}
		do
			local i = self.internal_counter
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < n) then
					break
				end
				local o = self.values[i + 1]
				local _c = c
				local _o = o
				table.insert(_c, _o)
			end
		end
		return Ok(RIterator:from(c))
	end
	function RIterator:collect_array()
		return self.values
	end
	function RIterator:partition(condition)
		local left = {}
		local right = {}
		local _values = self.values
		local _arg0 = function(v, i)
			if condition(v, i) then
				local _left = left
				local _v = v
				table.insert(_left, _v)
			else
				local _right = right
				local _v = v
				table.insert(_right, _v)
			end
		end
		for _k, _v in _values do
			_arg0(_v, _k - 1, _values)
		end
		return { left, right }
	end
end
return {
	default = RIterator,
}
