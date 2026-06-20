//
//  NotificationsManager.swift
//  CalkKG
//
//  Manages the user-facing local notification feature: a once-a-weekday
//  reminder ("Курсы валют на сегодня") so users open the app and check the
//  fresh NBKR rates without having to remember.
//
//  This is genuinely native (UserNotifications framework) and only useful
//  in the iOS app — adds value beyond what the web version provides.
//  Apple's 4.2 rejection specifically called out notifications as one of
//  the kinds of native features they expect.
//

import Foundation
import UserNotifications

final class NotificationsManager {
    static let shared = NotificationsManager()

    static let enabledKey = "calkkg_notifications_enabled_v1"
    static let notifId = "com.calkkg.dailyRatesReminder"

    private init() {}

    var isEnabled: Bool {
        get { UserDefaults.standard.bool(forKey: Self.enabledKey) }
        set { UserDefaults.standard.set(newValue, forKey: Self.enabledKey) }
    }

    /// Request OS permission. Safe to call repeatedly — the OS handles
    /// the "already decided" state internally.
    func requestPermission(_ completion: @escaping (Bool) -> Void) {
        let center = UNUserNotificationCenter.current()
        center.requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
            DispatchQueue.main.async { completion(granted) }
        }
    }

    /// Schedule a daily reminder at 10:00 local time.
    /// Idempotent: replaces the existing schedule if any.
    func scheduleDailyReminder() {
        let center = UNUserNotificationCenter.current()
        center.removePendingNotificationRequests(withIdentifiers: [Self.notifId])

        let content = UNMutableNotificationContent()
        content.title = "Курсы валют на сегодня"
        content.body = "Откройте Calk.KG, чтобы посмотреть актуальные курсы НБКР и конвертировать суммы."
        content.sound = .default

        var date = DateComponents()
        date.hour = 10
        date.minute = 0

        let trigger = UNCalendarNotificationTrigger(dateMatching: date, repeats: true)
        let request = UNNotificationRequest(identifier: Self.notifId, content: content, trigger: trigger)
        center.add(request) { error in
            if let error = error {
                NSLog("Failed to schedule reminder: \(error)")
            }
        }
        isEnabled = true
    }

    func cancelReminder() {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [Self.notifId])
        isEnabled = false
    }
}
