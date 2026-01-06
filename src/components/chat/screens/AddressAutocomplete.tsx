
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2 } from "lucide-react";

interface AddressAutocompleteProps {
    onSelect: (address: string) => void;
    placeholder?: string;
    initialValue?: string;
    className?: string;
}

interface OSMResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

export const AddressAutocomplete = ({ onSelect, placeholder = "Search for an address...", initialValue = "", className }: AddressAutocompleteProps) => {
    const [query, setQuery] = useState(initialValue);
    const [results, setResults] = useState<OSMResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length > 2 && showDropdown) {
                searchOSM(query);
            }
        }, 1000); // 1s debounce to be nice to OSM public API

        return () => clearTimeout(timer);
    }, [query, showDropdown]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const searchOSM = async (searchQuery: string) => {
        setLoading(true);
        try {
            // Nominatim usage policy requires a User-Agent. Browser usually sets one, but good to be aware.
            // Limited to 1 request per second strictly.
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("OSM Search Error:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item: OSMResult) => {
        setQuery(item.display_name);
        setShowDropdown(false);
        onSelect(item.display_name);
    };

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    placeholder={placeholder}
                    className="pl-9 pr-4"
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4 animate-spin" />
                )}
            </div>

            {showDropdown && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {results.map((item) => (
                        <button
                            key={item.place_id}
                            className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 flex items-start gap-2 border-b last:border-0 border-gray-100"
                            onClick={() => handleSelect(item)}
                            type="button"
                        >
                            <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                            <span className="line-clamp-2">{item.display_name}</span>
                        </button>
                    ))}
                    <div className="px-2 py-1 text-[10px] text-gray-400 text-right bg-gray-50/50">
                        Powered by OpenStreetMap
                    </div>
                </div>
            )}
        </div>
    );
};
