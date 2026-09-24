import Foundation
import Vision
import AppKit

// Receives one locally captured PNG on stdin; no cloud service is involved.
do {
    let data = FileHandle.standardInput.readDataToEndOfFile()
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["en-US"]
    request.usesLanguageCorrection = false
    request.minimumTextHeight = 0.015
    let handler = VNImageRequestHandler(data: data, options: [:])
    try handler.perform([request])
    let lines = (request.results ?? []).compactMap { observation -> [String: Any]? in
        guard let candidate = observation.topCandidates(1).first else { return nil }
        return ["text": candidate.string, "confidence": candidate.confidence]
    }
    let json = try JSONSerialization.data(withJSONObject: ["lines": lines])
    FileHandle.standardOutput.write(json)
} catch {
    FileHandle.standardError.write(Data(error.localizedDescription.utf8))
    exit(1)
}
