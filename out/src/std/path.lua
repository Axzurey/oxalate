-- Compiled with roblox-ts v2.1.1
local TS = _G[script]
local _option = TS.import(script, script.Parent, "option")
local None = _option.None
local Some = _option.Some
local RIterator = TS.import(script, script.Parent, "riterator").default
local Path
do
	Path = setmetatable({}, {
		__tostring = function()
			return "Path"
		end,
	})
	Path.__index = Path
	function Path.new(...)
		local self = setmetatable({}, Path)
		return self:constructor(...) or self
	end
	function Path:constructor(path)
		self.directory = RIterator:from(string.split(path, "/"))
	end
	function Path:from_path(path)
		return Path.new(table.concat(path.directory:collect_array(), "/"))
	end
	function Path:is_absolute()
		if self.directory:length() == 0 then
			return false
		end
		local zeroth = self.directory:nth(0)
		return zeroth:is_some() and zeroth:unwrap() == "game"
	end
	function Path:is_relative()
		if self.directory:length() == 0 then
			return false
		end
		local zeroth = self.directory:nth(0)
		return zeroth:is_some() and zeroth:unwrap() ~= "game"
	end
	function Path:to_string()
		return table.concat(self.directory:collect_array(), "/")
	end
	function Path:parent()
		if self.directory:length() == 0 then
			return None()
		end
		return Some(Path.new(table.concat(self.directory:take(self.directory:length() - 1):unwrap():collect_array(), "/")))
	end
	function Path:file_name()
		return self.directory:nth(self.directory:size_hint())
	end
	function Path:extension()
		return self.directory:nth(self.directory:length() - 1)
	end
	function Path:push(subpath)
		self.directory = self.directory:chain(RIterator:from(string.split(subpath, "/")))
	end
	function Path:to_iter()
		return RIterator:from_riter(self.directory)
	end
end
return {
	default = Path,
}
