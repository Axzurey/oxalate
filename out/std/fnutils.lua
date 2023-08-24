-- Compiled with roblox-ts v2.1.1
local TS = _G[script]
local _option = TS.import(script, script.Parent, "option")
local None = _option.None
local Some = _option.Some
local _result = TS.import(script, script.Parent, "result")
local Err = _result.Err
local Ok = _result.Ok
local function wrap_call(fn)
	local out = { pcall(fn) }
	if out[1] == true then
		return Ok(out[2])
	else
		return Err(out[2])
	end
end
local function get_callstack(max_stacks)
	if max_stacks == nil then
		max_stacks = 50
	end
	local stack = {}
	do
		local i = 2
		local _shouldIncrement = false
		while true do
			if _shouldIncrement then
				i += 1
			else
				_shouldIncrement = true
			end
			if not (i < max_stacks + 1) then
				break
			end
			local o = { debug.info(i, "slnaf") }
			if o[1] == nil then
				break
			end
			local _stack = stack
			local _o = o
			table.insert(_stack, _o)
		end
	end
	return stack
end
local function slice_array(array, slice)
	local x = {}
	if slice >= #array then
		return Err("Slice of " .. (tostring(slice) .. (" is greater index than the array with a length of " .. tostring(#array))))
	end
	if slice >= 0 then
		do
			local i = slice
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < #array) then
					break
				end
				local _x = x
				local _arg0 = array[i + 1]
				table.insert(_x, _arg0)
			end
		end
	else
		do
			local i = #array + slice
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < #array) then
					break
				end
				local _x = x
				local _arg0 = array[i + 1]
				table.insert(_x, _arg0)
			end
		end
	end
	return Ok(x)
end
local function shallow_eq(a, b)
	if #a ~= #b then
		return false
	end
	do
		local i = 0
		local _shouldIncrement = false
		while true do
			if _shouldIncrement then
				i += 1
			else
				_shouldIncrement = true
			end
			if not (i < #a) then
				break
			end
			if a[i + 1] ~= b[i + 1] then
				return false
			end
		end
	end
	return true
end
local function findFirstChildOption(inst, child)
	local result = inst:FindFirstChild(child)
	if result then
		return Some(result)
	end
	return None()
end
local function findFirstChildOfClassOption(inst, child)
	local result = inst:FindFirstChildOfClass(child)
	if result then
		return Some(result)
	end
	return None()
end
local function findFirstChildOfClassWithNameOption(inst, name, cls)
	for _, child in inst:GetChildren() do
		if child:IsA(cls) and child.Name == name then
			return Some(child)
		end
	end
	return None()
end
return {
	wrap_call = wrap_call,
	get_callstack = get_callstack,
	slice_array = slice_array,
	shallow_eq = shallow_eq,
	findFirstChildOption = findFirstChildOption,
	findFirstChildOfClassOption = findFirstChildOfClassOption,
	findFirstChildOfClassWithNameOption = findFirstChildOfClassWithNameOption,
}
