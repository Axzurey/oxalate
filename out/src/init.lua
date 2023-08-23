-- Compiled with roblox-ts v2.1.1
local TS = _G[script]
local exports = {}
for _k, _v in TS.import(script, script, "std", "riterator") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script, "std", "result") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script, "std", "path") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script, "std", "fnutils") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script, "std", "fs") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script, "std", "option") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script, "ref") or {} do
	exports[_k] = _v
end
return exports
