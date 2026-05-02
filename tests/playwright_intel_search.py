#!/usr/bin/env python3
"""Smoke tests for Intel Feed search. Run with static server: python3 -m http.server 8877 --bind 127.0.0.1"""
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8877"


def test_desktop():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(f"{BASE}/index.html#/home")
        page.wait_for_selector("#posts-grid .post-card", timeout=20000)
        assert page.is_visible("#header-search-input")
        page.fill("#header-search-input", "teampcp")
        page.wait_for_timeout(400)
        assert "matching" in (page.text_content("#feed-status") or "").lower()
        n = page.locator("#posts-grid .post-card").count()
        assert n > 0
        page.click(".feed-status-clear-btn")
        assert page.locator("#feed-status").inner_html().strip() == ""
        page.wait_for_timeout(400)
        page.fill("#header-search-input", "CVE-2026-33032")
        page.wait_for_timeout(400)
        n_cve = page.locator("#posts-grid .post-card").count()
        assert n_cve >= 1
        page.click(".feed-status-clear-btn")
        page.wait_for_timeout(200)
        page.goto(f"{BASE}/index.html#/home")
        page.wait_for_selector("#posts-grid .post-card", timeout=20000)
        page.click('a[href="#actors"]')
        page.wait_for_selector("#actor-table tbody tr", timeout=30000)
        page.fill("#header-search-input", "bitwarden")
        page.wait_for_timeout(400)
        assert "#home" in page.url
        assert page.locator("#posts-grid .post-card").count() > 0
        page.goto(f"{BASE}/index.html#/home")
        page.wait_for_selector("#posts-grid .post-card")
        page.click(".filter-btn[data-filter='supply-chain']")
        page.wait_for_timeout(200)
        page.fill("#header-search-input", "waveshaper-2026")
        page.wait_for_timeout(400)
        assert page.locator("#posts-grid .post-card").count() == 1
        page.locator(".stats-row .stat-card").nth(2).click()
        page.wait_for_selector("#modal-overlay.open")
        assert "IOC" in page.inner_text("#modal-content")
        page.keyboard.press("Escape")
        page.wait_for_timeout(200)
        assert page.locator("#modal-overlay.open").count() == 0
        browser.close()


def test_mobile():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 390, "height": 844})
        page.goto(f"{BASE}/index.html#/home")
        page.wait_for_selector("#posts-grid .post-card", timeout=20000)
        assert not page.is_visible("#header-search-input")
        assert page.is_visible("#mobile-search-btn")
        page.click("#mobile-search-btn")
        page.wait_for_selector("#search-modal-overlay.open")
        page.fill("#mobile-search-input", "marimo")
        page.click("#mobile-search-apply")
        page.wait_for_timeout(300)
        assert page.locator("#search-modal-overlay.open").count() == 0
        assert page.locator("#posts-grid .post-card").count() > 0
        page.click("#mobile-search-btn")
        page.click("#mobile-search-clear")
        page.keyboard.press("Escape")
        page.click(".nav-toggle")
        assert page.locator(".site-nav.open").count() > 0
        browser.close()


def main():
    test_desktop()
    print("desktop OK")
    test_mobile()
    print("mobile OK")


if __name__ == "__main__":
    main()
