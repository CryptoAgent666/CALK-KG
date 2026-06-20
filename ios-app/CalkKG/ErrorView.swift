//
//  ErrorView.swift
//  CalkKG
//
//  Shown when WebView fails to load (no internet, DNS error, etc).
//

import UIKit

final class ErrorView: UIView {

    var onRetry: (() -> Void)?

    private let iconLabel: UILabel = {
        let l = UILabel()
        l.text = "📡"
        l.font = .systemFont(ofSize: 64)
        l.textAlignment = .center
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()

    private let titleLabel: UILabel = {
        let l = UILabel()
        l.text = "Нет подключения к интернету"
        l.font = .systemFont(ofSize: 20, weight: .semibold)
        l.textAlignment = .center
        l.numberOfLines = 0
        l.textColor = .label
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()

    private let messageLabel: UILabel = {
        let l = UILabel()
        l.text = "Проверьте соединение и попробуйте ещё раз."
        l.font = .systemFont(ofSize: 15)
        l.textColor = .secondaryLabel
        l.textAlignment = .center
        l.numberOfLines = 0
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()

    private lazy var retryButton: UIButton = {
        let b = UIButton(type: .system)
        var cfg = UIButton.Configuration.filled()
        cfg.title = "Повторить"
        cfg.baseBackgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)
        cfg.baseForegroundColor = .white
        cfg.cornerStyle = .medium
        cfg.contentInsets = NSDirectionalEdgeInsets(top: 12, leading: 24, bottom: 12, trailing: 24)
        b.configuration = cfg
        b.translatesAutoresizingMaskIntoConstraints = false
        b.addTarget(self, action: #selector(didTapRetry), for: .touchUpInside)
        return b
    }()

    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .systemBackground

        let stack = UIStackView(arrangedSubviews: [iconLabel, titleLabel, messageLabel, retryButton])
        stack.axis = .vertical
        stack.alignment = .center
        stack.spacing = 12
        stack.translatesAutoresizingMaskIntoConstraints = false
        addSubview(stack)

        NSLayoutConstraint.activate([
            stack.centerXAnchor.constraint(equalTo: centerXAnchor),
            stack.centerYAnchor.constraint(equalTo: centerYAnchor),
            stack.leadingAnchor.constraint(greaterThanOrEqualTo: leadingAnchor, constant: 24),
            stack.trailingAnchor.constraint(lessThanOrEqualTo: trailingAnchor, constant: -24),
        ])
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    @objc private func didTapRetry() {
        onRetry?()
    }
}
