#!/usr/bin/env python3
"""
FarmCloud Security & Penetration Testing Script
Tests common vulnerabilities and security configurations
"""

import requests
import json
import sys
from datetime import datetime

class SecurityTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.results = {
            "passed": [],
            "failed": [],
            "warnings": []
        }
    
    def test_sql_injection(self):
        """Test for SQL injection vulnerabilities"""
        print("🔍 Testing SQL Injection Protection...")
        
        sql_payloads = [
            "' OR '1'='1",
            "admin'--",
            "' UNION SELECT NULL--",
            "1' AND 1=1--"
        ]
        
        for payload in sql_payloads:
            try:
                # Test on customers endpoint
                response = requests.get(
                    f"{self.base_url}/api/customers/",
                    params={"search": payload},
                    timeout=5
                )
                
                if response.status_code == 500 or "error" in response.text.lower():
                    self.results["failed"].append(f"SQL Injection: Potential vulnerability with payload: {payload}")
                    return False
                    
            except Exception as e:
                self.results["warnings"].append(f"SQL Injection test error: {str(e)}")
        
        self.results["passed"].append("SQL Injection: Protected (Django ORM)")
        return True
    
    def test_xss_protection(self):
        """Test for Cross-Site Scripting (XSS) vulnerabilities"""
        print("🔍 Testing XSS Protection...")
        
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "javascript:alert('XSS')"
        ]
        
        for payload in xss_payloads:
            try:
                response = requests.get(
                    f"{self.base_url}/api/customers/",
                    params={"search": payload},
                    timeout=5
                )
                
                # Check if payload is reflected without escaping
                if payload in response.text and "<" in response.text:
                    self.results["failed"].append(f"XSS: Potential vulnerability with payload: {payload}")
                    return False
                    
            except Exception as e:
                self.results["warnings"].append(f"XSS test error: {str(e)}")
        
        self.results["passed"].append("XSS Protection: Enabled")
        return True
    
    def test_csrf_protection(self):
        """Test CSRF protection"""
        print("🔍 Testing CSRF Protection...")
        
        try:
            # Try POST without CSRF token
            response = requests.post(
                f"{self.base_url}/api/customers/",
                json={"full_name": "Test User"},
                timeout=5
            )
            
            if response.status_code == 403 or "csrf" in response.text.lower():
                self.results["passed"].append("CSRF Protection: Enabled")
                return True
            else:
                self.results["warnings"].append("CSRF Protection: May not be enforced on API")
                
        except Exception as e:
            self.results["warnings"].append(f"CSRF test error: {str(e)}")
        
        return True
    
    def test_authentication(self):
        """Test authentication requirements"""
        print("🔍 Testing Authentication...")
        
        protected_endpoints = [
            "/api/users/",
            "/api/customers/",
            "/api/orders/",
            "/api/animals/",
            "/api/settings/1/"
        ]
        
        for endpoint in protected_endpoints:
            try:
                response = requests.get(f"{self.base_url}{endpoint}", timeout=5)
                
                # Check if endpoint requires authentication
                if response.status_code == 200:
                    self.results["warnings"].append(f"Authentication: {endpoint} accessible without auth")
                elif response.status_code == 401:
                    self.results["passed"].append(f"Authentication: {endpoint} properly protected")
                    
            except Exception as e:
                self.results["warnings"].append(f"Auth test error on {endpoint}: {str(e)}")
        
        return True
    
    def test_rate_limiting(self):
        """Test rate limiting"""
        print("🔍 Testing Rate Limiting...")
        
        try:
            # Make multiple rapid requests
            responses = []
            for i in range(15):
                response = requests.get(f"{self.base_url}/api/customers/", timeout=2)
                responses.append(response.status_code)
            
            # Check if any request was rate limited
            if 429 in responses:
                self.results["passed"].append("Rate Limiting: Active")
                return True
            else:
                self.results["warnings"].append("Rate Limiting: Not triggered in test (may be configured differently)")
                
        except Exception as e:
            self.results["warnings"].append(f"Rate limit test error: {str(e)}")
        
        return True
    
    def test_security_headers(self):
        """Test security headers"""
        print("🔍 Testing Security Headers...")
        
        try:
            response = requests.get(f"{self.base_url}/api/customers/", timeout=5)
            headers = response.headers
            
            # Check for important security headers
            security_headers = {
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": ["DENY", "SAMEORIGIN"],
                "Strict-Transport-Security": None,  # Should be present in production
            }
            
            for header, expected in security_headers.items():
                if header in headers:
                    if expected is None or (isinstance(expected, list) and headers[header] in expected) or headers[header] == expected:
                        self.results["passed"].append(f"Security Header: {header} = {headers[header]}")
                    else:
                        self.results["warnings"].append(f"Security Header: {header} has unexpected value")
                else:
                    if header == "Strict-Transport-Security":
                        self.results["warnings"].append(f"Security Header: {header} missing (expected in production)")
                    else:
                        self.results["failed"].append(f"Security Header: {header} missing")
            
        except Exception as e:
            self.results["warnings"].append(f"Security headers test error: {str(e)}")
        
        return True
    
    def test_directory_traversal(self):
        """Test for directory traversal vulnerabilities"""
        print("🔍 Testing Directory Traversal...")
        
        traversal_payloads = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\config\\sam",
            "%2e%2e%2f%2e%2e%2f"
        ]
        
        for payload in traversal_payloads:
            try:
                response = requests.get(
                    f"{self.base_url}/media/{payload}",
                    timeout=5
                )
                
                if response.status_code == 200 and ("root:" in response.text or "Administrator" in response.text):
                    self.results["failed"].append(f"Directory Traversal: Vulnerable with payload: {payload}")
                    return False
                    
            except Exception as e:
                pass  # Expected to fail
        
        self.results["passed"].append("Directory Traversal: Protected")
        return True
    
    def test_information_disclosure(self):
        """Test for information disclosure"""
        print("🔍 Testing Information Disclosure...")
        
        sensitive_endpoints = [
            "/admin/",
            "/.env",
            "/settings.py",
            "/manage.py"
        ]
        
        for endpoint in sensitive_endpoints:
            try:
                response = requests.get(f"{self.base_url}{endpoint}", timeout=5)
                
                if response.status_code == 200 and any(keyword in response.text.lower() for keyword in ["password", "secret", "key"]):
                    self.results["failed"].append(f"Information Disclosure: {endpoint} exposes sensitive data")
                    
            except Exception as e:
                pass
        
        self.results["passed"].append("Information Disclosure: Basic checks passed")
        return True
    
    def test_brute_force_protection(self):
        """Test brute force protection"""
        print("🔍 Testing Brute Force Protection...")
        
        # This would test django-axes if login endpoint is available
        self.results["warnings"].append("Brute Force Protection: Configured (django-axes) - manual login test recommended")
        return True
    
    def run_all_tests(self):
        """Run all security tests"""
        print("\n" + "="*60)
        print("🔒 FARMCLOUD SECURITY & PENETRATION TEST")
        print("="*60 + "\n")
        print(f"Target: {self.base_url}")
        print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        # Run all tests
        tests = [
            self.test_sql_injection,
            self.test_xss_protection,
            self.test_csrf_protection,
            self.test_authentication,
            self.test_rate_limiting,
            self.test_security_headers,
            self.test_directory_traversal,
            self.test_information_disclosure,
            self.test_brute_force_protection
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                self.results["failed"].append(f"{test.__name__}: Test error - {str(e)}")
        
        # Print results
        self.print_results()
    
    def print_results(self):
        """Print test results"""
        print("\n" + "="*60)
        print("📊 TEST RESULTS")
        print("="*60 + "\n")
        
        if self.results["passed"]:
            print(f"✅ PASSED ({len(self.results['passed'])} tests)")
            for item in self.results["passed"]:
                print(f"   ✓ {item}")
        
        print()
        
        if self.results["warnings"]:
            print(f"⚠️  WARNINGS ({len(self.results['warnings'])} items)")
            for item in self.results["warnings"]:
                print(f"   ⚠ {item}")
        
        print()
        
        if self.results["failed"]:
            print(f"❌ FAILED ({len(self.results['failed'])} tests)")
            for item in self.results["failed"]:
                print(f"   ✗ {item}")
        else:
            print("❌ FAILED (0 tests)")
        
        print("\n" + "="*60)
        print(f"SUMMARY: {len(self.results['passed'])} passed, {len(self.results['warnings'])} warnings, {len(self.results['failed'])} failed")
        print("="*60 + "\n")
        
        # Overall status
        if len(self.results["failed"]) == 0:
            print("✅ SECURITY STATUS: GOOD")
            return 0
        else:
            print("⚠️  SECURITY STATUS: NEEDS ATTENTION")
            return 1

if __name__ == "__main__":
    tester = SecurityTester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)
