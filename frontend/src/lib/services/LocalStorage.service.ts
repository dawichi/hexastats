import type { ReportDto } from '$lib/types'

enum Keys {
    PLAYERS = 'players',
    REPORTS = 'reports',
}

/**
 * ## Service to manage the localStorage data
 */
class Reports {
    static list(): Array<ReportDto> {
        return JSON.parse(localStorage.getItem(Keys.REPORTS) ?? '[]')
    }

    static add(report: ReportDto): void {
        const list = Reports.list()

        // If the new player was present, remove it
        // const idx = list.findIndex((p) => p.name === player.name)
        // if (idx !== -1) list.splice(idx, 1)

        // Max store 4 reports
        if (list.length > 3) list.pop()

        localStorage.setItem(Keys.REPORTS, JSON.stringify([report, ...list]))
    }
}

export const LocalStorageService = {
    reports: Reports,
}
