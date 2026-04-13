import {
  CategoryCard,
  useReorderCategoriesMutation,
  type Category
} from '@/entities/category'
import CategoryActions from '@/features/category/category-actions'
import { LoadingOverlay, Stack } from '@mantine/core'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import type {
  CategoryDragItem,
  Props,
  SortableCategoryItemProps
} from './types'

const CATEGORY_DND_TYPE = 'category'

function SortableCategoryItem({
  item,
  index,
  restaurantId,
  isSorting,
  draggingId,
  dropTargetId,
  onMove,
  onDragStart,
  onDragEnd,
  onDropTargetChange
}: SortableCategoryItemProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: CATEGORY_DND_TYPE,
      item: () => {
        onDragStart(item.id)
        return { id: item.id, index }
      },
      canDrag: !isSorting,
      end: () => {
        onDragEnd()
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [index, isSorting, item.id, onDragEnd, onDragStart]
  )

  const [, drop] = useDrop(
    () => ({
      accept: CATEGORY_DND_TYPE,
      hover: (draggedItem: CategoryDragItem, monitor) => {
        if (!ref.current || draggedItem.index === index) {
          return
        }

        const hoverBoundingRect = ref.current.getBoundingClientRect()
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
        const clientOffset = monitor.getClientOffset()

        if (!clientOffset) {
          return
        }

        const hoverClientY = clientOffset.y - hoverBoundingRect.top

        if (draggedItem.index < index && hoverClientY < hoverMiddleY) {
          return
        }

        if (draggedItem.index > index && hoverClientY > hoverMiddleY) {
          return
        }

        onDropTargetChange(item.id)
        onMove(draggedItem.index, index)
        draggedItem.index = index
      }
    }),
    [index, item.id, onDropTargetChange, onMove]
  )

  drag(drop(ref))

  return (
    <div ref={ref}>
      <CategoryCard
        data={item}
        className={cn('cursor-grab', {
          'cursor-grabbing border-moss-400 bg-moss-50 opacity-70':
            isDragging || draggingId === item.id,
          'border-moss-300 bg-moss-50/60':
            !isDragging && dropTargetId === item.id && draggingId !== item.id
        })}
        renderActions={(category) => (
          <CategoryActions
            data={category}
            restaurantId={restaurantId}
            actionIconProps={{ variant: 'default' }}
          />
        )}
      />
    </div>
  )
}

export function ReorderCategoriesFeature({
  items: initialItems,
  restaurantId
}: Props) {
  const [items, setItems] = useState<Category[]>(initialItems)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const itemsRef = useRef<Category[]>(initialItems)
  const reorderMutation = useReorderCategoriesMutation(restaurantId)

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const moveItem = (sourceIndex: number, targetIndex: number) => {
    setItems((currentItems) => {
      if (
        sourceIndex === -1 ||
        targetIndex === -1 ||
        sourceIndex === targetIndex
      ) {
        return currentItems
      }

      const nextItems = [...currentItems]
      const [movedItem] = nextItems.splice(sourceIndex, 1)

      nextItems.splice(targetIndex, 0, movedItem)

      return nextItems
    })
  }

  const persistOrder = (nextItems: Category[]) => {
    if (nextItems.length < 2) {
      return
    }

    const nextCategoryIds = nextItems.map((item) => item.id)
    const currentCategoryIds = initialItems.map((item) => item.id)

    const isOrderChanged = nextCategoryIds.some(
      (categoryId, index) => categoryId !== currentCategoryIds[index]
    )

    if (!isOrderChanged) {
      return
    }

    reorderMutation.mutate({
      categoryIds: nextCategoryIds
    })
  }

  const handleDragStart = (categoryId: string) => {
    setDraggingId(categoryId)
    setDropTargetId(categoryId)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setDropTargetId(null)
    persistOrder(itemsRef.current)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Stack className="relative w-full">
        <LoadingOverlay
          visible={reorderMutation.isPending}
          zIndex={10}
          overlayProps={{ radius: 'md', blur: 1 }}
        />

        {items.map((item, index) => (
          <SortableCategoryItem
            key={item.id}
            item={item}
            index={index}
            restaurantId={restaurantId}
            isSorting={reorderMutation.isPending}
            draggingId={draggingId}
            dropTargetId={dropTargetId}
            onMove={moveItem}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDropTargetChange={setDropTargetId}
          />
        ))}
      </Stack>
    </DndProvider>
  )
}
