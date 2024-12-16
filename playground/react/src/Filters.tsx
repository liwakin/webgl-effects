import { useState } from 'react'
import type { EffectsCtx } from 'webgl-effects'

import { filters } from '../../common/filters'

export const Filfers = ({ effectsCtx }: { effectsCtx: EffectsCtx | null }) => {
  if (!effectsCtx) {
    return null
  }

  const [filterState, setFilterState] = useState(
    filters.map((filter) => ({
      ...filter,
      preset: filter.filterClass.preset,
      active: false
    }))
  )

  const onClick = (clickedFilter: (typeof filters)[number]) => {
    setFilterState((prevFilters) =>
      prevFilters.map((filter) => {
        if (filter.filterClass !== clickedFilter.filterClass) {
          return filter
        }

        const newActive = !filter.active
        if (newActive) {
          effectsCtx.filter.add(filter.filterClass)
          // TODO: Modify configuration through the form
          effectsCtx.filter.updateOptions(filter.filterClass, filter.preset)
        } else {
          effectsCtx.filter.remove(filter.filterClass)
        }

        return { ...filter, active: newActive }
      })
    )
  }

  return (
    <ul className="filters">
      {filterState.map((filter, index) => (
        <li key={index}>
          <button
            className={filter.active ? 'filter-button active' : 'filter-button'}
            onClick={() => onClick(filter)}
          >
            {filter.label}
          </button>
        </li>
      ))}
    </ul>
  )
}
