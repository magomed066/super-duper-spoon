import { useEffect, useState, type ChangeEvent } from 'react'
import { ActionIcon, Select, TextInput } from '@mantine/core'
import { BsSearch } from 'react-icons/bs'
import { useRestaurantFilters } from '../hooks/use-restaurant-filters'
import { RESTAURANT_STATUS_FILTERS } from '@/entities/restaurant'
import { RiResetLeftFill } from 'react-icons/ri'

export function FiltersRestaurants() {
  const {
    search,
    setSearch,
    status,
    setStatus,
    hasActiveFilters,
    resetFilters
  } = useRestaurantFilters()
  const [inputValue, setInputValue] = useState(search)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setInputValue(value)
  }

  useEffect(() => {
    setInputValue(search)
  }, [search])

  useEffect(() => {
    if (inputValue === search) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSearch(inputValue)
    }, 1000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [inputValue, search, setSearch])

  const handleReset = () => {
    setInputValue('')
    setSearch('')
    resetFilters()
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="w-full max-w-75">
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

      <ActionIcon
        variant="default"
        onClick={handleReset}
        disabled={!hasActiveFilters}
        size="lg"
      >
        <RiResetLeftFill size={24} className="text-moss-700" />
      </ActionIcon>
    </div>
  )
}
