-- Compiled with roblox-ts v2.1.1
local TS = _G[script]
local _option = TS.import(script, script.Parent, "option")
local None = _option.None
local Some = _option.Some
local _result = TS.import(script, script.Parent, "result")
local Err = _result.Err
local Ok = _result.Ok
local _fnutils = TS.import(script, script.Parent, "fnutils")
local findFirstChildOfClassWithNameOption = _fnutils.findFirstChildOfClassWithNameOption
local findFirstChildOption = _fnutils.findFirstChildOption
local get_callstack = _fnutils.get_callstack
local wrap_call = _fnutils.wrap_call
local fs = {}
do
	local _container = fs
	local function get_roblox_instance(path)
		local cd = game
		for _, split in string.split(path, ".") do
			local o = cd:FindFirstChild(split)
			if o == nil then
				return None()
			end
			cd = o
		end
		return Some(cd)
	end
	local function matchFileExt(str)
		local res = wrap_call(function()
			local out = { string.find(str, "(.+)%.(.+)") }
			return { out[3], out[4] }
		end)
		if res:is_err() then
			return Err(res:unwrap_err())
		end
		local _exp = res:unwrap()
		local _arg0 = function(v)
			return if v == nil then "" else v
		end
		-- ▼ ReadonlyArray.map ▼
		local _newValue = table.create(#_exp)
		for _k, _v in _exp do
			_newValue[_k] = _arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.map ▲
		return Ok(_newValue)
	end
	local function formatInstancePath(inst)
		return (string.gsub(inst:GetFullName(), "%.", "/"))
	end
	local function resolve_to_array(path)
		local path_buf = {}
		local first = true
		for _, token in path:collect_array() do
			if token == ".." then
				path_buf[#path_buf] = nil
			elseif token == "." then
				local _path_buf = path_buf
				local _arg0 = formatInstancePath(get_roblox_instance(get_callstack()[3][1]):unwrap())
				table.insert(_path_buf, _arg0)
			else
				if first and token ~= "game" then
					local _path_buf = path_buf
					local _arg0 = formatInstancePath(get_roblox_instance(get_callstack()[3][1]):unwrap())
					table.insert(_path_buf, _arg0)
				else
					local _path_buf = path_buf
					local _token = token
					table.insert(_path_buf, _token)
				end
			end
			first = false
		end
		return path_buf
	end
	local function get_from_resolved_path(resolved)
		local current = game
		do
			local i = 1
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < #resolved) then
					break
				end
				if i == #resolved - 1 then
					local f = matchFileExt(resolved[i + 1])
					if f:is_ok() then
						local file, ext = f:unwrap()[1], f:unwrap()[2]
						if ext == "" or ext == "*" then
							local c = findFirstChildOption(current, file):ok_or("Path " .. (table.concat(resolved, "/") .. (" doesn't exist. " .. (file .. (" isn't a valid member of " .. resolved[i - 1 + 1])))))
							return c
						else
							local c = findFirstChildOfClassWithNameOption(current, file, ext):ok_or("Path " .. (table.concat(resolved, "/") .. (" doesn't exist. Tail " .. (file .. ("." .. (ext .. (" isn't a valid member of " .. resolved[i - 1 + 1])))))))
							return c
						end
					else
						return Err("Unable to match file name and extension for tail (" .. (resolved[i + 1] .. (") of path " .. table.concat(resolved, "/"))))
					end
				else
					local o = findFirstChildOption(current, resolved[i + 1]):ok_or("Path " .. (table.concat(resolved, "/") .. (" doesn't exist. " .. (resolved[i + 1] .. (" isn't a valid member of " .. resolved[i - 1 + 1])))))
					if o:is_ok() then
						current = o:unwrap()
					else
						return o
					end
				end
			end
		end
		return Ok(current)
	end
	local function resolve(path)
		return get_from_resolved_path(resolve_to_array(path:to_iter()))
	end
	_container.resolve = resolve
end
local default = fs
return {
	default = default,
}
