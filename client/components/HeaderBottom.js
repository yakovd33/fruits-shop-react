import React from 'react'
import Link from 'next/link'

const HeaderBottom = () => {
  return (
    <div id="header-bottom">
        <div className="container">
            <div className="right">
                <Link href="/category/1">
                    <a className="header-bottom-link">ירקות</a>
                </Link>

                <Link href="/category/2">
                    <a className="header-bottom-link">פירות</a>
                </Link>

                <Link href="/category/3">
                    <a className="header-bottom-link">מעדנייה</a>
                </Link>

                <Link href="/category/4">
                    <a className="header-bottom-link">ירק ופטריות</a>
                </Link>

                <Link href="/category/5">
                    <a className="header-bottom-link">מזווה</a>
                </Link>
            </div>

            <span id="header-bottom-center"></span>

            <div className="left">
                <Link href="/category/6">
                    <a className="header-bottom-link">יבשים</a>
                </Link>

                <Link href="/category/7">
                    <a className="header-bottom-link">מבצעים</a>
                </Link>

                <Link href="/category/8">
                    <a className="header-bottom-link">ירקות</a>
                </Link>

                <Link href="/category/9">
                    <a className="header-bottom-link">ירקות</a>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default HeaderBottom