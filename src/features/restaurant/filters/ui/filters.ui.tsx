import { useEffect, useState, type ChangeEvent } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { Select, TextInput } from '@mantine/core'
import { BsSearch } from 'react-icons/bs'
import { useRestaurantFilters } from '../hooks/use-restaurant-filters'
import { RESTAURANT_STATUS_FILTERS } from '@/entities/restaurant'

export function FiltersRestaurants() {
  const { search, setSearch, status, setStatus } = useRestaurantFilters()
  const [inputValue, setInputValue] = useState(search)
  const [debouncedValue] = useDebounceValue(inputValue, 1000)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setInputValue(value)
  }

  useEffect(() => {
    setInputValue(search)
  }, [search])

  useEffect(() => {
    if (debouncedValue === search) {
      return
    }

    setSearch(debouncedValue)
  }, [debouncedValue, search, setSearch])

  return (
    <div className="flex items-center gap-3">
      <div className="max-w-75 w-full">
        <TextInput
          value={inputValue}
          onChange={handleSearch}
          leftSection={<BsSearch />}
          placeholder="Введите название ресторана"
        />
      </div>

      <Select
        value={status}
        onChange={setStatus}
        placeholder="Статус ресторана"
        data={RESTAURANT_STATUS_FILTERS}
        allowDeselect={false}
      />
    </div>
  )
}
