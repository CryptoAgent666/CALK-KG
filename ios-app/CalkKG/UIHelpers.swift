//
//  UIHelpers.swift
//  CalkKG
//
//  Small UI factories shared across the native calculator screens.
//  Keeps the calculator VCs focused on their domain logic instead of
//  boilerplate button/label construction.
//

import UIKit

enum ButtonFactory {
    /// Brand-red primary action button used for "Save" / main CTA.
    static func primary(title: String, icon: String, target: Any?, action: Selector) -> UIButton {
        let b = UIButton(type: .system)
        b.setTitle(title, for: .normal)
        b.setImage(UIImage(systemName: icon), for: .normal)
        b.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
        b.layer.cornerRadius = 10
        b.backgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)
        b.tintColor = .white
        b.setTitleColor(.white, for: .normal)
        b.heightAnchor.constraint(equalToConstant: 48).isActive = true
        b.addTarget(target, action: action, for: .touchUpInside)
        // Modern UIButtonConfiguration handles image padding correctly
        if #available(iOS 15.0, *) {
            var cfg = UIButton.Configuration.filled()
            cfg.title = title
            cfg.image = UIImage(systemName: icon)
            cfg.imagePadding = 8
            cfg.baseBackgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)
            cfg.baseForegroundColor = .white
            cfg.cornerStyle = .medium
            b.configuration = cfg
        }
        return b
    }

    /// Subtle secondary button (system-style) used for "Share".
    static func secondary(title: String, icon: String, target: Any?, action: Selector) -> UIButton {
        let b = UIButton(type: .system)
        b.heightAnchor.constraint(equalToConstant: 48).isActive = true
        b.addTarget(target, action: action, for: .touchUpInside)
        if #available(iOS 15.0, *) {
            var cfg = UIButton.Configuration.gray()
            cfg.title = title
            cfg.image = UIImage(systemName: icon)
            cfg.imagePadding = 8
            cfg.cornerStyle = .medium
            b.configuration = cfg
        } else {
            b.setTitle(title, for: .normal)
            b.setImage(UIImage(systemName: icon), for: .normal)
            b.backgroundColor = .secondarySystemBackground
            b.tintColor = .label
            b.layer.cornerRadius = 10
        }
        return b
    }
}

enum LabeledField {
    /// Stack: tiny label on top + the input field. Used to keep input
    /// rows uniform without each VC re-rolling the layout.
    static func make(_ text: String, field: UITextField) -> UIView {
        let label = UILabel()
        label.text = text
        label.font = .systemFont(ofSize: 14, weight: .medium)
        label.textColor = .secondaryLabel
        let stack = UIStackView(arrangedSubviews: [label, field])
        stack.axis = .vertical
        stack.spacing = 6
        return stack
    }
}

enum SummaryRow {
    /// Two-column row: label on the left, bold value on the right.
    /// Default text color is `.label`; pass `.systemRed` etc. for
    /// negative / "overpaid" amounts to draw attention.
    static func make(_ label: String, _ value: String, color: UIColor = .label) -> UIStackView {
        let l = UILabel()
        l.text = label
        l.font = .systemFont(ofSize: 15)
        l.textColor = .secondaryLabel
        let v = UILabel()
        v.text = value
        v.font = .systemFont(ofSize: 15, weight: .semibold)
        v.textColor = color
        v.textAlignment = .right
        let s = UIStackView(arrangedSubviews: [l, v])
        s.axis = .horizontal
        s.distribution = .equalSpacing
        return s
    }
}
