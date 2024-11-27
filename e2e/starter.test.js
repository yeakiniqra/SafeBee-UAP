describe('Signin', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have Signin screen', async () => {
    // Scroll down if necessary
    await waitFor(element(by.id('signin-title')))
      .toBeVisible()
      .whileElement(by.id('scroll-view')).scroll(50, 'down'); // Scroll to find the element if needed

    // Check if the "Sign in to your" text is visible
    await expect(element(by.id('signin-title'))).toBeVisible();

    // Check if the "Account" text is visible
    await expect(element(by.id('signin-subtitle'))).toBeVisible();

    // Check if the email input is visible
    await expect(element(by.id('email-input'))).toBeVisible();

    // Check if the password input is visible
    await expect(element(by.id('password-input'))).toBeVisible();

    // Check if the sign in button is visible
    await expect(element(by.id('signin-button'))).toBeVisible();
  });
});
