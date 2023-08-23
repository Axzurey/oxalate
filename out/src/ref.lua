-- Compiled with roblox-ts v2.1.1
local Ref
do
	Ref = setmetatable({}, {
		__tostring = function()
			return "Ref"
		end,
	})
	Ref.__index = Ref
	function Ref.new(...)
		local self = setmetatable({}, Ref)
		return self:constructor(...) or self
	end
	function Ref:constructor(value)
		self.value = value
	end
	function Ref:get()
		return self.value
	end
	function Ref:set(value)
		self.value = value
	end
end
return {
	default = Ref,
}
