import { ReactElement, useMemo, useState } from 'react'
import useCurrentPath from 'hooks/use-current-path'
import Button from 'components/button'
import SidebarBackToLink from './components/sidebar-back-to-link'
import SidebarFilterInput from './components/sidebar-filter-input'
import {
  SidebarNavMenuItem,
  SidebarSkipToMainContent,
  SidebarTitleHeading,
} from 'components/sidebar/components'
import { MenuItem, SidebarProps } from './types'
import s from './sidebar.module.css'
import { IconChevronLeft16 } from '@hashicorp/flight-icons/svg-react/chevron-left-16'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import classNames from 'classnames'

const SIDEBAR_LABEL_ID = 'sidebar-label'

const addItemMetadata = (
  currentPath: string,
  items: MenuItem[]
): { foundActiveItem: boolean; itemsWithMetadata: MenuItem[] } => {
  let foundActiveItem = false

  const itemsWithMetadata = items.map((item) => {
    const itemCopy = { ...item }

    if (item.routes) {
      const result = addItemMetadata(currentPath, item.routes)
      itemCopy.routes = result.itemsWithMetadata
      // Note: if an active item has already been found,
      // we do not flag this category as active.
      itemCopy.hasActiveChild = !foundActiveItem && result.foundActiveItem
      // Flag if we've found an active item
      foundActiveItem = itemCopy.hasActiveChild || foundActiveItem
    } else if (item.path) {
      // Note: if an active item has already been found,
      // we do not flag this node as active.
      itemCopy.isActive = !foundActiveItem && currentPath.endsWith(item.path)
      // Flag if we've found an active item
      foundActiveItem = itemCopy.isActive || foundActiveItem
    } else {
      // TODO: are there any other cases to cover?
    }

    return itemCopy
  })

  return { foundActiveItem, itemsWithMetadata }
}

/**
 * This does not use Array.filter because we need to add metadata to each item
 * that is used for determining the open/closed state of submenu items.
 */
const getFilteredMenuItems = (items: MenuItem[], filterValue: string) => {
  if (!filterValue) {
    return items
  }

  const filteredItems = []

  items.forEach((item) => {
    const itemCopy = { ...item }
    let matchingChildren: MenuItem[]
    let hasChildrenMatchingFilter = false

    const doesTitleMatchFilter = item?.title
      ?.toLowerCase()
      .includes(filterValue.toLowerCase())
    /**
     * If an item's title matches the filter, we want to include it and its
     * children in the filter results. `matchesFilter` is added to all items
     * with a title that matches, and is used in `SidebarNavSubmenu` to
     * determine if a submenu should be open when searching.
     *
     * If an item's title doesn't match the filter, then we need to recursively
     * look at the children of a submenu to see if any of those have titles or
     * subemnus that match the filter.
     *
     * TODO: write test cases to document this functionality more clearly
     */
    if (doesTitleMatchFilter) {
      itemCopy.matchesFilter = true
      filteredItems.push(itemCopy)
    } else if (item.routes) {
      matchingChildren = getFilteredMenuItems(item.routes, filterValue)
      hasChildrenMatchingFilter = matchingChildren.length > 0
      itemCopy.hasChildrenMatchingFilter = hasChildrenMatchingFilter
      itemCopy.routes = matchingChildren

      if (hasChildrenMatchingFilter) {
        filteredItems.push(itemCopy)
      }
    }
  })

  return filteredItems
}

const Sidebar = ({
  backToLinkProps,
  levelButtonProps,
  menuItems,
  showFilterInput = true,
  title,
  visuallyHideTitle = false,
}: SidebarProps): ReactElement => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const { itemsWithMetadata } = useMemo(
    () => addItemMetadata(currentPath, menuItems),
    [currentPath, menuItems]
  )
  const [filterValue, setFilterValue] = useState('')
  const filteredMenuItems = getFilteredMenuItems(itemsWithMetadata, filterValue)

  let backToElement
  if (levelButtonProps) {
    const { iconPosition, onClick, text } = levelButtonProps
    backToElement = (
      <Button
        className={classNames(s.levelButton, {
          [s.levelButtonWithLeadingIcon]: iconPosition === 'leading',
          [s.levelButtonWithTrailingIcon]: iconPosition === 'trailing',
          [s.levelButtonBeforeFilterInput]: showFilterInput,
          [s.levelButtonBeforeHeading]: !showFilterInput && !visuallyHideTitle,
          [s.levelButtonBeforeNavItem]: !showFilterInput && visuallyHideTitle,
        })}
        color="tertiary"
        icon={
          iconPosition === 'leading' ? (
            <IconChevronLeft16 />
          ) : (
            <IconChevronRight16 />
          )
        }
        iconPosition={iconPosition}
        onClick={onClick}
        text={text}
      />
    )
  } else if (backToLinkProps) {
    const { text, url } = backToLinkProps
    backToElement = <SidebarBackToLink text={text} url={url} />
  }

  return (
    <div className={s.sidebar}>
      {backToElement}
      {showFilterInput && (
        <SidebarFilterInput value={filterValue} onChange={setFilterValue} />
      )}
      <nav aria-labelledby={SIDEBAR_LABEL_ID} className={s.nav}>
        <SidebarTitleHeading text={title} id={SIDEBAR_LABEL_ID} />
        <SidebarSkipToMainContent />
        <ul className={s.navList}>
          {filteredMenuItems.map((item) => (
            <SidebarNavMenuItem item={item} key={item.id} />
          ))}
        </ul>
      </nav>
    </div>
  )
}

export type { MenuItem, SidebarProps }
export default Sidebar
