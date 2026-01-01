import React from 'react'
import HeaderBottomLink from './HeaderBottomLink'

const links = [
  { href: '/category/1', categoryId: 1, title: 'ירקות' },
  { href: '/category/2', categoryId: 2, title: 'פירות' },
  { href: '/category/3', categoryId: 3, title: 'מעדנייה' },
  { href: '/category/4', categoryId: 4, title: 'ירק ופטריות' },
  { href: '/category/5', categoryId: 5, title: 'מזווה' },
  { href: '/category/6', categoryId: 6, title: 'יבשים' },
  { href: '/category/7', title: 'מבצעים' },
  { href: '/category/28', categoryId: 28, title: 'מארזים' },
  { href: '/category/25', categoryId: 25, title: 'המיוחדים' }
]

const HeaderBottom = ({ subCategories }) => {
  return (
    <div id="header-bottom">
      <div className="container" id="header-bottom-container">
        {links.map((link) => (
          <HeaderBottomLink
            key={link.title}
            href={link.href}
            categoryId={link.categoryId}
            title={link.title}
            subCategories={subCategories}
          />
        ))}
      </div>
    </div>
  )
}

export default HeaderBottom